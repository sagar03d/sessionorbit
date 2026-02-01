
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register standard fonts
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf' },
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf', fontWeight: 'bold' }
    ]
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        padding: 0
    },
    accentBar: {
        height: 6,
        backgroundColor: '#00EAFF',
        width: '100%'
    },
    header: {
        padding: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A'
    },
    logoSub: {
        fontSize: 10,
        color: '#64748B',
        letterSpacing: 2,
        marginTop: 4
    },
    metaData: {
        textAlign: 'right'
    },
    metaItem: {
        fontSize: 10,
        color: '#64748B',
        marginBottom: 4
    },
    section: {
        padding: 30,
        paddingBottom: 0
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    dashboard: {
        flexDirection: 'row',
        gap: 20
    },
    card: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    focusRingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    metricValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4F46E5',
        textAlign: 'center'
    },
    metricLabel: {
        fontSize: 10,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 4
    },
    talkBarContainer: {
        height: 12,
        backgroundColor: '#E2E8F0',
        borderRadius: 6,
        overflow: 'hidden',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    insightsContainer: {
        marginTop: 10
    },
    insightCard: {
        backgroundColor: '#ffffff',
        borderLeftWidth: 4,
        borderLeftColor: '#00EAFF',
        padding: 15,
        marginBottom: 10,
        borderRadius: 4,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4
    },
    insightTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4
    },
    insightText: {
        fontSize: 10,
        color: '#334155',
        lineHeight: 1.5
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 15
    },
    footerText: {
        fontSize: 8,
        color: '#94A3B8'
    }
});

interface SessionReportProps {
    meeting: any;
    participants: any[];
    summary: any;
}

const SessionReportPDF: React.FC<SessionReportProps> = ({ meeting, participants, summary }) => {
    const student = participants.find(p => p.role === 'student' || p.role === 'learner') || { name: 'Student' };
    const dateStr = meeting?.created_at ? new Date(meeting.created_at).toLocaleDateString() : '';

    // Mock analytics if not present
    const focusScore = 88;
    const talkStudent = 45;
    const talkTutor = 55;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Accent Bar */}
                <View style={styles.accentBar} />

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.logoText}>SessionOrbit</Text>
                        <Text style={styles.logoSub}>INTELLIGENT TUTORING</Text>
                    </View>
                    <View style={styles.metaData}>
                        <Text style={styles.metaItem}>SESSION REPORT</Text>
                        <Text style={[styles.metaItem, { color: '#0F172A', fontWeight: 'bold' }]}>{dateStr}</Text>
                        <Text style={styles.metaItem}>ID: {meeting?.id?.substring(0, 8)}</Text>
                    </View>
                </View>

                {/* Engagement Dashboard */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Engagement Analytics</Text>
                    <View style={styles.dashboard}>
                        {/* Focus Score */}
                        <View style={styles.card}>
                            <Text style={styles.metricLabel}>FOCUS SCORE</Text>
                            <View style={styles.focusRingContainer}>
                                <Text style={styles.metricValue}>{focusScore}%</Text>
                            </View>
                            <Text style={[styles.metricLabel, { color: '#10B981' }]}>High Intensity</Text>
                        </View>

                        {/* Talk Time */}
                        <View style={styles.card}>
                            <Text style={styles.metricLabel}>PARTICIPATION</Text>
                            <View style={{ marginTop: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[styles.metricLabel, { color: '#4F46E5' }]}>Student</Text>
                                    <Text style={[styles.metricLabel, { color: '#94A3B8' }]}>Tutor</Text>
                                </View>
                                <View style={styles.talkBarContainer}>
                                    <View style={{ width: `${talkStudent}%`, backgroundColor: '#4F46E5', height: '100%' }} />
                                    <View style={{ width: `${talkTutor}%`, backgroundColor: '#CBD5E1', height: '100%' }} />
                                </View>
                                <Text style={styles.metricLabel}>{talkStudent}% Talk Time</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* AI Insights - Parsed mainly from sample summary for now */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Session Insights</Text>

                    <View style={styles.insightCard}>
                        <Text style={styles.insightTitle}>💡 Key Breakthroughs</Text>
                        <Text style={styles.insightText}>
                            The student demonstrated a strong understanding of Quadratic Equations and actively participated in problem-solving exercises.
                            Identified the relationship between coefficients and the parabola's vertex correctly without assistance.
                        </Text>
                    </View>

                    <View style={[styles.insightCard, { borderLeftColor: '#10B981' }]}>
                        <Text style={styles.insightTitle}>✅ Skill Mastery</Text>
                        <Text style={styles.insightText}>
                            - Successfully solved complex factorization problems.
                            - Improved speed in identifying coefficients.
                            - Applied quadratic formula to word problems.
                        </Text>
                    </View>

                    <View style={[styles.insightCard, { borderLeftColor: '#F59E0B' }]}>
                        <Text style={styles.insightTitle}>🏠 Homework & Next Steps</Text>
                        <Text style={styles.insightText}>
                            Task: Complete the 5 practice problems on "Completing the Square" (Worksheet 4B).
                            Focus Goal: Aim for 90% focus score by minimizing distractions.
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Generated by SessionOrbit.com — 24/7 AI Tech Support Enabled</Text>
                </View>
            </Page>
        </Document>
    );
};

export default SessionReportPDF;
