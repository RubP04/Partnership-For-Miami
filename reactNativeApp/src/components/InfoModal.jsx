import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';

const InfoModal = ({ visible, onClose, fileNumber }) => {
    const [details, setDetails] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (visible && fileNumber) {
            fetchEntryDetails();
            fetchAISummary();
        }
    }, [visible, fileNumber]);

    const fetchEntryDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching details for file number:', fileNumber);
            const response = await fetch(`http://localhost:5000/api/entry/${fileNumber}`);
            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Received data:', data);
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch entry details');
            }
            
            setDetails(data);
        } catch (err) {
            console.error('Detailed error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAISummary = async () => {
        try {
            setSummaryLoading(true);
            const response = await fetch(`http://localhost:5000/api/entry/${fileNumber}/summary`);
            const data = await response.json();
            
            if (data.status === "initializing") {
                setSummary(data.summary);
                setTimeout(() => fetchAISummary(), data.retry_after * 1000);
                return;
            }
            
            setSummary(data.summary);
        } catch (err) {
            console.error('AI Summary error:', err);
            setSummary('Unable to generate AI summary at this time.');
        } finally {
            setSummaryLoading(false);
        }
    };

    const openPDF = async () => {
        if (details?.detailed_pdf_url && details.detailed_pdf_url !== "N/A") {
            try {
                await Linking.openURL(details.detailed_pdf_url);
            } catch (err) {
                console.error('Error opening PDF:', err);
            }
        }
    };

    const openURL = async (url) => {
        if (url && url !== "N/A") {
            try {
                await Linking.openURL(url);
            } catch (err) {
                console.error('Error opening URL:', err);
            }
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007AFF" />
                            <Text style={styles.loadingText}>Loading details...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.error}>{error}</Text>
                            <TouchableOpacity 
                                style={styles.retryButton}
                                onPress={fetchEntryDetails}
                            >
                                <Text style={styles.retryButtonText}>Retry</Text>
                            </TouchableOpacity>
                        </View>
                    ) : details ? (
                        <ScrollView style={styles.detailsContainer}>
                            <Text style={styles.title}>{details.title || 'No Title Available'}</Text>
                            
                            <View style={styles.summaryContainer}>
                                <Text style={styles.summaryTitle}>AI Summary</Text>
                                {summaryLoading ? (
                                    <View style={styles.summaryLoading}>
                                        <ActivityIndicator size="small" color="#007AFF" />
                                        <Text style={styles.summaryLoadingText}>Generating summary...</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.summaryText}>{summary}</Text>
                                )}
                            </View>

                            {Object.entries({
                                'File Number': details.file_number,
                                'File Type': details.file_type,
                                'Status': details.status,
                                'Introduced': details.introduced,
                                'Requester': details.requester,
                                'Cost': details.cost,
                                'Final Action': details.final_action,
                                'Sponsors': details.sponsors,
                                'Effective Date': details.effective_date,
                                'Registered Lobbyist': details.registered_lobbyist,
                            }).map(([key, value]) => (
                                <View key={key} style={styles.detailRow}>
                                    <Text style={styles.label}>{key}:</Text>
                                    <Text style={styles.value}>{value || 'N/A'}</Text>
                                </View>
                            ))}

                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Detailed URL Link:</Text>
                                {details.detailed_url && details.detailed_url !== "N/A" ? (
                                    <TouchableOpacity onPress={() => openURL(details.detailed_url)}>
                                        <Text style={styles.linkText}>View Details Online</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text style={styles.value}>N/A</Text>
                                )}
                            </View>

                            {details.detailed_pdf_url && details.detailed_pdf_url !== "N/A" && (
                                <TouchableOpacity style={styles.pdfButton} onPress={openPDF}>
                                    <Text style={styles.pdfButtonText}>View PDF</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noDataText}>No details available</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
    },
    detailsContainer: {
        marginTop: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontWeight: 'bold',
        width: '35%',
        color: '#666',
    },
    value: {
        flex: 1,
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    pdfButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    pdfButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    retryButton: {
        marginTop: 10,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    noDataText: {
        textAlign: 'center',
        color: '#666',
        padding: 20,
    },
    summaryContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#007AFF',
    },
    summaryText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    summaryLoading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    summaryLoadingText: {
        marginLeft: 10,
        color: '#666',
    },
    linkText: {
        color: '#007AFF',
        textDecorationLine: 'underline',
        flex: 1,
    },
});

export default InfoModal;