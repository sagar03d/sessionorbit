import { Document, Page, Text, View, StyleSheet, Link, Svg, Path, Circle, Defs, LinearGradient, Stop } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: '#0B0C15',
        fontFamily: 'Helvetica',
        color: '#F8FAFC',
    },
    // Decorative Borders
    cornerTopLeft: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 20,
        height: 20,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderColor: '#00EAFF',
    },
    cornerTopRight: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 20,
        height: 20,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: '#00EAFF',
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 20,
        height: 20,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: '#00EAFF',
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 20,
        height: 20,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderColor: '#00EAFF',
    },
    // Header
    header: {
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        color: '#94a3b8',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    statusBadge: {
        backgroundColor: 'rgba(0, 234, 255, 0.1)',
        border: '1px solid rgba(0, 234, 255, 0.3)',
        borderRadius: 4,
        padding: '4 8',
    },
    statusText: {
        color: '#00EAFF',
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    // Sections
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#6366F1',
        paddingLeft: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#00EAFF',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // Cards & Boxes
    card: {
        backgroundColor: '#151725',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderRadius: 6,
        padding: 12,
        marginBottom: 10,
    },
    // Metrics
    metricsGrid: {
        flexDirection: 'row',
        gap: 10,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#151725',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderRadius: 6,
        padding: 12,
    },
    metricLabel: {
        fontSize: 8,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    progressBarBg: {
        height: 3,
        backgroundColor: '#1e293b',
        borderRadius: 1.5,
        marginTop: 8,
    },
    // Tables/Lists
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    rowLabel: {
        flex: 1,
        fontSize: 10,
        color: '#cbd5e1',
    },
    badge: {
        padding: '2 6',
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 8,
        fontWeight: 'bold',
    },
    // AI Summary
    summaryText: {
        fontSize: 10,
        lineHeight: 1.6,
        color: '#cbd5e1',
        marginBottom: 8,
    },
    highlight: {
        color: '#00EAFF',
    },
    // Transcript
    transcriptBox: {
        backgroundColor: '#0f111a',
        borderLeftWidth: 1,
        borderColor: '#334155',
    },
    transcriptRow: {
        flexDirection: 'row',
        padding: '6 10',
        marginBottom: 4,
    },
    speaker: {
        width: 35,
        fontSize: 8,
        fontWeight: 'bold',
        color: '#6366F1',
        marginRight: 8,
    },
    transcriptContent: {
        flex: 1,
        fontSize: 9,
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    // Footer/Video
    videoSection: {
        marginTop: 10,
        padding: 15,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    link: {
        fontSize: 10,
        color: '#00EAFF',
        textDecoration: 'none',
    }
});

export const ScribeReportPDF = () => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Decorative Corners */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            {/* Vector Background Elements */}
            <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} fixed>
                <Svg viewBox="0 0 595 842" style={{ width: '100%', height: '100%' }}>
                    <Defs>
                        <LinearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor="#6366F1" stopOpacity="0.1" />
                            <Stop offset="1" stopColor="#00EAFF" stopOpacity="0" />
                        </LinearGradient>
                    </Defs>
                    <Circle cx="500" cy="100" r="150" fill="url(#grad1)" />
                    <Path d="M 50 800 L 150 800 L 160 790" stroke="#1e293b" strokeWidth="1" />
                </Svg>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>SESSION REPORT</Text>
                    <Text style={styles.subtitle}>ORBITAL INTELLIGENCE • SYSTEM V2.0</Text>

                    <View style={{ flexDirection: 'row', gap: 15, marginTop: 15 }}>
                        <View>
                            <Text style={{ fontSize: 8, color: '#64748b' }}>SUBJECT</Text>
                            <Text style={{ fontSize: 10, color: '#F8FAFC', fontWeight: 'bold' }}>Advanced Calculus: Derivatives</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 8, color: '#64748b' }}>DATE</Text>
                            <Text style={{ fontSize: 10, color: '#F8FAFC', fontWeight: 'bold' }}>OCT 24, 2024</Text>
                        </View>
                        <View>
                            <Text style={{ fontSize: 8, color: '#64748b' }}>DURATION</Text>
                            <Text style={{ fontSize: 10, color: '#F8FAFC', fontWeight: 'bold' }}>45 MINS</Text>
                        </View>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>ANALYSIS COMPLETE</Text>
                    </View>
                    <Text style={{ fontSize: 8, color: '#64748b', marginTop: 4 }}>ID: #8X-9291-AZ</Text>
                </View>
            </View>

            {/* Access Recording Section (New Request) */}
            <View style={styles.section}>
                <View style={styles.videoSection}>
                    <View>
                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>SESSION RECORDING AVAILABLE</Text>
                        <Text style={{ fontSize: 8, color: '#94a3b8', marginTop: 2 }}>Full high-definition recording with whiteboard playback.</Text>
                    </View>
                    <Link src="https://example.com/recording" style={styles.link}>
                        WATCH PLAYBACK →
                    </Link>
                </View>
            </View>

            {/* Metrics */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Performance Telemetry</Text>
                </View>
                <View style={styles.metricsGrid}>
                    {/* Focus Score */}
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Focus Score</Text>
                        <Text style={styles.metricValue}>94%</Text>
                        <View style={styles.progressBarBg}>
                            <View style={{ height: '100%', width: '94%', backgroundColor: '#8b5cf6', borderRadius: 1.5 }} />
                        </View>
                    </View>

                    {/* Understanding */}
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Understanding</Text>
                        <Text style={styles.metricValue}>High</Text>
                        <View style={styles.progressBarBg}>
                            <View style={{ height: '100%', width: '85%', backgroundColor: '#10b981', borderRadius: 1.5 }} />
                        </View>
                    </View>

                    {/* Participation */}
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Participation</Text>
                        <Text style={styles.metricValue}>Active</Text>
                        <View style={styles.progressBarBg}>
                            <View style={{ height: '100%', width: '90%', backgroundColor: '#3b82f6', borderRadius: 1.5 }} />
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 20 }}>
                {/* Left: Concept Mastery */}
                <View style={{ width: '40%' }}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Concept Mastery</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Chain Rule</Text>
                            <Text style={{ fontSize: 8, color: '#10b981' }}>MASTERED</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Product Rule</Text>
                            <Text style={{ fontSize: 8, color: '#10b981' }}>MASTERED</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowLabel}>Trig Derivatives</Text>
                            <Text style={{ fontSize: 8, color: '#f59e0b' }}>REVIEWING</Text>
                        </View>
                        <View style={[styles.row, { borderBottomWidth: 0 }]}>
                            <Text style={styles.rowLabel}>Implicit Diff.</Text>
                            <Text style={{ fontSize: 8, color: '#3b82f6' }}>IN PROGRESS</Text>
                        </View>
                    </View>
                </View>

                {/* Right: AI Summary */}
                <View style={{ flex: 1 }}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>AI Executive Summary</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.summaryText}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Session Highlights: </Text>
                            Sarah demonstrated an excellent grasp of the Chain Rule concepts introduced today. We successfully solved 5 complex derivative problems.
                        </Text>
                        <Text style={styles.summaryText}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Key Breakthrough: </Text>
                            The "Eureka" moment came when we visualized the nested functions as layers of an onion.
                        </Text>
                        <Text style={[styles.summaryText, { marginBottom: 0 }]}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Areas for Improvement: </Text>
                            She initially struggled with nested trigonometric compositions but corrected this after review.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ height: 10 }} />

            {/* Transcript */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Transcript Logic Flow</Text>
                </View>
                <View style={[styles.card, styles.transcriptBox]}>
                    <View style={styles.transcriptRow}>
                        <Text style={styles.speaker}>TUTOR</Text>
                        <Text style={styles.transcriptContent}>"Think of sin(x²). What's the outside function here?"</Text>
                    </View>
                    <View style={styles.transcriptRow}>
                        <Text style={[styles.speaker, { color: '#c084fc' }]}>SARAH</Text>
                        <Text style={styles.transcriptContent}>"Oh! It's the sine function. And x² is inside it."</Text>
                    </View>
                    <View style={styles.transcriptRow}>
                        <Text style={styles.speaker}>TUTOR</Text>
                        <Text style={styles.transcriptContent}>"Exactly. So differentiate the outside first..."</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={{ position: 'absolute', bottom: 30, left: 30, right: 30, borderTopWidth: 1, borderTopColor: '#1e293b', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 8, color: '#475569' }}>GENERATED BY SESSIONORBIT AI</Text>
                <Text style={{ fontSize: 8, color: '#475569' }}>PAGE 1 OF 1</Text>
            </View>

        </Page>
    </Document>
);
