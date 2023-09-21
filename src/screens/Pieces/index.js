import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text as RNText, TouchableOpacity, Image, Animated, Modal, Button, Linking, TextInput } from 'react-native';
import EquipmentService from '../../services/equipments';
import ItemService from '../../services/items';

function Text(props) {
    return <RNText {...props} style={[props.style, {}]} />;
}

export default function PiecesScreen() {
    const categories = ['Equipamento', 'Peça', 'Produto'];
    const states = ['Novo', 'Semi-novo'];
    const [pieces, setPieces] = useState([]);
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [buttonOpacity] = useState(new Animated.Value(0));
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filter, setFilter] = useState({ categories: [], brands: [], states: [] });

    const fetchPieces = async () => {
        const equipmentData = await EquipmentService.getAllEquipments();
        const itemData = await ItemService.getAllItems();
        setPieces([...equipmentData, ...itemData]);
    };

    useEffect(() => {
        fetchPieces();
    }, []);

    useEffect(() => {
        Animated.timing(buttonOpacity, {
            toValue: selectedPieces.length > 0 ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [selectedPieces.length]);

    const handlePiecePress = (piece) => {
        setSelectedPieces(selectedPieces => selectedPieces.find(selected => selected.id === piece.id)
            ? selectedPieces.filter(selected => selected.id !== piece.id)
            : [...selectedPieces, piece]);
    };

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        return currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";
    };

    const handleWhatsAppRedirect = () => {
        let greeting = getGreeting();
        let pieceNames = selectedPieces.map(piece => piece.name).join(', ');
        let message = `${greeting}, estou interessado ${selectedPieces.length > 1 ? 'nos itens:' : 'no item:'} ${pieceNames}. Teria em estoque?`;
        let whatsappUrl = `https://api.whatsapp.com/send/?phone=%2B5547992531701&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
        Linking.openURL(whatsappUrl);
    };

    const filteredPieces = pieces.filter(piece =>
        piece.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filter.categories.length === 0 || filter.categories.includes(piece.category)) &&
        (filter.brands.length === 0 || filter.brands.includes(piece.brand)) &&
        (filter.states.length === 0 || filter.states.includes(piece.state))
    );

    const handleFilterSelect = (type, value) => {
        setFilter(prev => ({ ...prev, [type]: prev[type].includes(value) ? prev[type].filter(item => item !== value) : [...prev[type], value] }));
    };

    const isFiltering = Object.values(filter).some(arr => arr.length > 0);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 28 }}>
                <View style={{ flexDirection: 'row', height: 40, borderColor: 'rgba(0, 0, 0, 0.1)', borderWidth: 1, marginBottom: 20, borderRadius: 12, alignItems: 'center', paddingLeft: 10, height: 50 }}>
                    <Image
                        source={{ uri: 'https://cdn.discordapp.com/attachments/1059425565330911284/1131838979226996756/magnifying-glass.png' }}
                        style={{ width: 20, height: 20, marginRight: 10, opacity: 0.6 }}
                    />
                    <TextInput
                        style={{ flex: 1, fontFamily: 'Poppins_400Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.6)' }}
                        placeholder="pesquisar..."
                        placeholderTextColor="rgba(0, 0, 0, 0.6)"
                        onChangeText={text => setSearchQuery(text)}
                        value={searchQuery}
                    />
                    <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                        <Image
                            source={{ uri: isFiltering ? 'https://cdn.discordapp.com/attachments/1059425565330911284/1132890835923513425/filter-list_1.png' : 'https://cdn.discordapp.com/attachments/1059425565330911284/1131874814110474300/filter-list.png' }}
                            style={{ width: 20, height: 20, marginRight: 20, opacity: 0.7 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {filteredPieces.map((piece) => (
                        <TouchableOpacity key={piece.id} onPress={() => handlePiecePress(piece)} style={{ width: '48%', marginBottom: 20, backgroundColor: '#F9F9F9', borderRadius: 10, padding: 10, alignItems: 'center', borderColor: selectedPieces.some(p => p.id === piece.id) ? '#FB5F21' : 'transparent', borderWidth: 2 }}>
                            <Image 
                                source={{ uri: piece.image.url }}
                                style={{ width: '100%', height: 150, resizeMode: 'contain', marginBottom: 10, borderRadius: 10 }}
                            />
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16 }}>{piece.name}</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.6)' }}>{piece.model || piece.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <Animated.View style={{ opacity: buttonOpacity }}>
                {selectedPieces.length > 0 && (
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            backgroundColor: '#FB5F21',
                            padding: 10,
                            borderRadius: 50,
                            marginTop: 10,
                            width: '80%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            flexWrap: 'wrap',
                            position: 'absolute',
                            bottom: 20,
                            left: '10%',
                        }}
                        onPress={handleWhatsAppRedirect}
                    >
                        <Image
                            source={{ uri: 'https://cdn.discordapp.com/attachments/1059425565330911284/1131679603073761451/whatsapp.png' }}
                            style={{ width: 24, height: 24, marginRight: 10 }}
                        />
                        <Text style={{ color: 'white', fontSize: 16, fontFamily: "Poppins_400Regular" }}>{`Solicitar item${selectedPieces.length > 1 ? 's' : ''} selecionado${selectedPieces.length > 1 ? 's' : ''}`}</Text>
                    </TouchableOpacity>
                )}
            </Animated.View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => {
                    setFilterModalVisible(!filterModalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <Image
                                    source={{ uri: 'https://cdn.discordapp.com/attachments/1059425565330911284/1131880234996727860/close.png' }}
                                    style={{ width: 24, height: 24 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalDescription}>Selecione os filtros que deseja aplicar. Você pode selecionar mais de um por vez.</Text>
                        <Text style={styles.modalSubtitle}>Por categoria:</Text>
                        <ScrollView horizontal contentContainerStyle={styles.filterOptions}>
                            {categories.map(category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[styles.filterButton, { backgroundColor: filter.categories.includes(category) ? '#FB5F21' : '#E5E5E5' }]}
                                    onPress={() => handleFilterSelect('categories', category)}
                                >
                                    <Text style={[styles.filterText, { color: filter.categories.includes(category) ? '#FFFFFF' : '#000000' }]}>{category}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Text style={styles.modalSubtitle}>Por estado:</Text>
                        <ScrollView horizontal contentContainerStyle={styles.filterOptions}>
                            {states.map(state => (
                                <TouchableOpacity
                                    key={state}
                                    style={[styles.filterButton, { backgroundColor: filter.states.includes(state) ? '#FB5F21' : '#E5E5E5' }]}
                                    onPress={() => handleFilterSelect('states', state)}
                                >
                                    <Text style={[styles.filterText, { color: filter.states.includes(state) ? '#FFFFFF' : '#000000' }]}>{state}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.filterActions}>
                            <TouchableOpacity
                                style={styles.applyFilterButton}
                                onPress={() => setFilterModalVisible(false)}
                            >
                                <Text style={styles.applyFilterText}>Aplicar filtros</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.clearFilterButton}
                                onPress={() => setFilter({ categories: [], brands: [], states: [] })}
                            >
                                <Text style={styles.clearFilterText}>Limpar filtros</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    buttonTitle: {
        fontFamily: "Poppins_600SemiBold",
        fontSize: 15,
    },
    buttonText: {
        fontFamily: "Poppins_400Regular",
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins_600SemiBold',
        textAlign: 'left',
    },
    modalDescription: {
        paddingTop: 7,
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: 'rgba(0, 0, 0, 0.6)',
        marginBottom: 10,
        textAlign: 'left',
    },
    modalSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins_400Regular',
        marginTop: 10,
    },
    filterOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterButton: {
        borderRadius: 50,
        marginVertical: 5,
        padding: 8,
        marginRight: 10,
        minWidth: 65,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterText: {
        fontFamily: 'Poppins_400Regular',
        textAlign: 'center',
        fontSize: 13.5,
    },
    filterActions: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    clearFilterButton: {
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 15,
        marginBottom: 20,
    },
    clearFilterText: {
        color: '#FB5F21',
        textAlign: 'center',
        fontFamily: 'Poppins_400Regular',
    },
    applyFilterButton: {
        backgroundColor: '#FB5F21',
        borderRadius: 50,
        width: 280,
        padding: 15,
        marginBottom: 20,
    },
    applyFilterText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Poppins_600SemiBold',
    },
});
