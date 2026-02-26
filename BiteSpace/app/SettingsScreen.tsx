    import React from 'react';
    import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
    import { useRouter } from 'expo-router';


    const SettingsScreen = () => {
    const router = useRouter();
    const handleEditDetails = () => Alert.alert('Edit Profile Details', 'Navigate to Edit Profile Details screen.');
    const handleEditPrivacy = () => Alert.alert('Edit Privacy Settings', 'Navigate to Edit Privacy Settings screen.');
    const handleChangePassword = () => Alert.alert('Change Password', 'Navigate to Change Password screen.');
    const handleBiteSpacePremium = () => Alert.alert('BiteSpace Premium', 'Navigate to BiteSpace Premium subscription screen.');
    const handleLogout = () => {
        router.push("/LoginScreen")
        Alert.alert('Logout', 'You have been logged out.');
    }

    return (
        <View style={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>

        {/* Edit Profile Details */}
        <TouchableOpacity style={styles.button} onPress={handleEditDetails}>
            <Text style={styles.buttonText}>Edit Profile Details</Text>
        </TouchableOpacity>

        {/* Edit Privacy Settings */}
        <TouchableOpacity style={styles.button} onPress={handleEditPrivacy}>
            <Text style={styles.buttonText}>Edit Privacy Settings</Text>
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        {/* BiteSpace Premium */}
        <TouchableOpacity style={styles.button} onPress={handleBiteSpacePremium}>
            <Text style={styles.buttonText}>BiteSpace Premium</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    button: {
        backgroundColor: 'lightblue', // Light blue color
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    });

    export default SettingsScreen;
