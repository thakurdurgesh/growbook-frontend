import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const { user, isLoading, error, logout, linkGoogleAccount, unlinkGoogleAccount } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const handleLinkGoogle = async () => {
    try {
      await linkGoogleAccount();
      Alert.alert('Success', 'Google account linked successfully');
    } catch (err) {
      Alert.alert('Error', error || 'Failed to link Google account');
    }
  };

  const handleUnlinkGoogle = async () => {
    try {
      await unlinkGoogleAccount();
      Alert.alert('Success', 'Google account unlinked successfully');
    } catch (err) {
      Alert.alert('Error', error || 'Failed to unlink Google account');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!user) {
    // If no user is logged in, redirect to login
    router.replace('/login');
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.profileHeader}>
        {user.avatar_url ? (
          <Image 
            source={{ uri: user.avatar_url }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </Text>
          </View>
        )}
        
        <Text style={styles.name}>{user.name || 'Growbook User'}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      
      <View style={styles.accountSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        {user.google_connected ? (
          <TouchableOpacity 
            style={[styles.button, styles.unlinkButton]} 
            onPress={handleUnlinkGoogle}
            disabled={isLoading}
          >
            <Text style={styles.unlinkButtonText}>Unlink Google Account</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.linkButton]} 
            onPress={handleLinkGoogle}
            disabled={isLoading}
          >
            <Text style={styles.linkButtonText}>Link Google Account</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.editProfileButton]} 
          onPress={() => Alert.alert('Coming Soon', 'Edit profile feature is coming soon!')}
        >
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarInitial: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  accountSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  linkButton: {
    backgroundColor: '#DB4437', // Google red
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  unlinkButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DB4437',
  },
  unlinkButtonText: {
    color: '#DB4437',
    fontSize: 16,
    fontWeight: '500',
  },
  editProfileButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  editProfileButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
  },
});
