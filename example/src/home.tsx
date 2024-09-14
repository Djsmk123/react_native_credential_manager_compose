
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import credentialManager from 'react-native-rn-credential-manager';

interface LogoutButtonProps {

    onLogout: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
    const handleLogout = async () => {
        try {
            await credentialManager.instance.logout();

            console.log('Logged out successfully');
            // Call the onLogout callback to update the app state
            onLogout();
            // You might want to navigate to a login screen or update the app state here
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#f44336',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default LogoutButton;
