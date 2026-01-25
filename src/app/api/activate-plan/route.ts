import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

// Private admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
    try {
        const { paymentId, planName } = await req.json()

        // 1. Get user session to verify who is making the request
        // In a real app, you'd use the Supabase auth helper to get the session from headers/cookies
        // For this boilerplate, we'll expect a valid session to be verifiable
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        console.log(`Verified User: ${user.id}. Activating Plan: ${planName}`)

        // 2. (Optional but Recommended) Verify with Dodo Payments API
        // const dodoResponse = await fetch(`https://api.dodopayments.com/v1/payments/${paymentId}`, {
        //     headers: { 'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}` }
        // })
        // const dodoData = await dodoResponse.json()
        // if (dodoData.status !== 'succeeded') throw new Error('Payment not verified')

        const expiryDate = new Date()
        expiryDate.setMonth(expiryDate.getMonth() + 1)

        // 3. Update Subscriptions in DB (Bypassing RLS with Admin Client)
        // Using manual check + insert/update to avoid "ON CONFLICT" constraint issues in some Supabase setups
        const { data: existingSub } = await supabaseAdmin
            .from('subscriptions')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle()

        if (existingSub) {
            const { error: subError } = await supabaseAdmin
                .from('subscriptions')
                .update({
                    plan_name: planName,
                    status: 'active',
                    expiry_date: expiryDate.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingSub.id)
            if (subError) throw subError
        } else {
            const { error: subError } = await supabaseAdmin
                .from('subscriptions')
                .insert({
                    user_id: user.id,
                    plan_name: planName,
                    status: 'active',
                    expiry_date: expiryDate.toISOString()
                })
            if (subError) throw subError
        }

        // 4. Update Profile
        const { error: profileError } = await supabaseAdmin.from('profiles').update({
            plan: planName,
            plan_expiry: expiryDate.toISOString()
        }).eq('id', user.id)

        if (profileError) throw profileError

        return NextResponse.json({ success: true, plan: planName })
    } catch (error: any) {
        console.error('Activation API Error:', error)
        return NextResponse.json({ error: error.message || 'Activation failed' }, { status: 500 })
    }
}
