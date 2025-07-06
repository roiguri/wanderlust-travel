import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { X, MapPin, Calendar, DollarSign, FileText, Globe } from 'lucide-react-native';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import CreateTripFlow from './CreateTripFlow';
import { theme } from '@/theme';

interface CreateTripModalProps {
  isVisible: boolean;
  return <CreateTripFlow isVisible={isVisible} onClose={onClose} />;
}