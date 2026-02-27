import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {

        // 1. Alter organizations table
        const { error: alterError } = await supabaseAdmin.rpc('exec_sql', {
            sql: `
                ALTER TABLE organizations 
                ADD COLUMN IF NOT EXISTS billing_cycle_anchor TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                ADD COLUMN IF NOT EXISTS classroom_hours_used NUMERIC DEFAULT 0,
                ADD COLUMN IF NOT EXISTS ai_scribe_reports_used INTEGER DEFAULT 0;
            `
        });

        if (alterError) {
            console.error("Error altering organizations:", alterError);
        }

        // 2. Create invoices table
        const { error: createError } = await supabaseAdmin.rpc('exec_sql', {
            sql: `
                CREATE TABLE IF NOT EXISTS invoices (
                    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
                    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
                    amount NUMERIC NOT NULL,
                    status TEXT DEFAULT 'pending', -- pending, paid, etc.
                    billing_period_start TIMESTAMP WITH TIME ZONE,
                    billing_period_end TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );

                -- Enable RLS (allow reading own invoices)
                ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

                CREATE POLICY "Users can view their organization invoices"
                    ON invoices FOR SELECT
                    USING (
                        organization_id IN (
                            SELECT organization_id FROM profiles WHERE id = auth.uid()
                        )
                    );
            `
        });

        if (createError) {
            console.error("Error creating invoices table:", createError);
        }

        return NextResponse.json({ success: true, alterError, createError });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
