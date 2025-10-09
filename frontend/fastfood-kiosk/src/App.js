import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InitialScreen from './components/InitialScreen';
import FaceRecognition from './components/FaceRecognition'; // Correct FaceRecognition component
import FaceRecognition2 from './components/FaceRecognition2'; // FaceRecognition2 for SecretRoot
import SecretRoot from './components/SecretRoot'; // SecretRoot page 이 코드는 추후 제외해서 깃헙에 업로드

// General Order Components
import GeneralMenuScreen from './components/GeneralMenuScreen';
import OrderDetailsScreen from './components/OrderDetailsScreen';
import DineOptionScreen from './components/DineOptionScreen';
import PaymentMethodScreen from './components/PaymentMethodScreen';
import CardPaymentScreen from './components/CardPaymentScreen';
import BarcodeScannerScreen from './components/BarcodeScannerScreen';
import PaymentCompletionScreen from './components/PaymentCompletionScreen';

// Elderly Order Components
import ElderlyMenuScreen from './components/ElderlyMenuScreen';
import ElderlyOrderDetailsScreen from './components/ElderlyOrderDetailsScreen';
import ElderlyDineOptionScreen from './components/ElderlyDineOptionScreen';
import ElderlyPaymentMethodScreen from './components/ElderlyPaymentMethodScreen';
import ElderlyCardPaymentScreen from './components/ElderlyCardPaymentScreen';
import ElderlyBarcodeScannerScreen from './components/ElderlyBarcodeScannerScreen';
import ElderlyPaymentCompletionScreen from './components/ElderlyPaymentCompletionScreen';

// Children Order Components
import ChildrenMenuScreen from './components/ChildrenMenuScreen';
import ChildrenOrderDetailsScreen from './components/ChildrenOrderDetailsScreen';
import ChildrenDineOptionScreen from './components/ChildrenDineOptionScreen';
import ChildrenPaymentMethodScreen from './components/ChildrenPaymentMethodScreen';
import ChildrenCardPaymentScreen from './components/ChildrenCardPaymentScreen';
import ChildrenBarcodeScannerScreen from './components/ChildrenBarcodeScannerScreen';
import ChildrenPaymentCompletionScreen from './components/ChildrenPaymentCompletionScreen';

function App() {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleAddToOrder = (newItem) => {
        setSelectedItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex(
                (item) => item.name === newItem.name && item.option === newItem.option
            );
            if (existingItemIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += newItem.quantity;
                return updatedItems;
            } else {
                return [...prevItems, newItem];
            }
        });
    };

    const handleCancelAll = () => {
        setSelectedItems([]);
    };

    return (
        <Router>
            <Routes>
                {/* Initial Screen with Emergency button leading to SecretRoot */}
                <Route path="/" element={<InitialScreen />} />

                {/* SecretRoot with public button leading to FaceRecognition2 */}
                <Route path="/secret-root" element={<SecretRoot />} />

                {/* Correct Face Recognition route for InitialScreen */}
                <Route path="/face-recognition" element={<FaceRecognition />} />

                {/* FaceRecognition2 for SecretRoot */}
                <Route path="/face-recognition-2" element={<FaceRecognition2 />} />

                {/* General Order Flow */}
                <Route 
                    path="/general-menu" 
                    element={<GeneralMenuScreen handleAddToOrder={handleAddToOrder} />} 
                />
                <Route 
                    path="/order-details" 
                    element={<OrderDetailsScreen selectedItems={selectedItems} handleCancelAll={handleCancelAll} nextPage="/dine-option" />} 
                />
                <Route 
                    path="/dine-option" 
                    element={<DineOptionScreen nextPage="/payment-method" />} 
                />
                <Route 
                    path="/payment-method" 
                    element={<PaymentMethodScreen />} 
                />
                <Route 
                    path="/card-payment" 
                    element={<CardPaymentScreen nextPage="/payment-completion" />} 
                />
                <Route 
                    path="/barcode-scanner" 
                    element={<BarcodeScannerScreen nextPage="/payment-completion" />} 
                />
                <Route 
                    path="/payment-completion" 
                    element={<PaymentCompletionScreen />} 
                />

                {/* Elderly Order Flow */}
                <Route 
                    path="/elderly-menu" 
                    element={<ElderlyMenuScreen handleAddToOrder={handleAddToOrder} />} 
                />
                <Route 
                    path="/elderly-order-details" 
                    element={<ElderlyOrderDetailsScreen selectedItems={selectedItems} nextPage="/elderly-dine-option" />} 
                />
                <Route 
                    path="/elderly-dine-option" 
                    element={<ElderlyDineOptionScreen nextPage="/elderly-payment-method" />} 
                />
                <Route 
                    path="/elderly-payment-method" 
                    element={<ElderlyPaymentMethodScreen />} 
                />
                <Route 
                    path="/elderly-card-payment" 
                    element={<ElderlyCardPaymentScreen nextPage="/elderly-payment-completion" />} 
                />
                <Route 
                    path="/elderly-barcode-scanner" 
                    element={<ElderlyBarcodeScannerScreen nextPage="/elderly-payment-completion" />} 
                />
                <Route 
                    path="/elderly-payment-completion" 
                    element={<ElderlyPaymentCompletionScreen />} 
                />


                {/* Children Order Flow */}
                <Route 
                    path="/children-menu" 
                    element={<ChildrenMenuScreen handleAddToOrder={handleAddToOrder} />} 
                />
                <Route 
                    path="/children-order-details" 
                    element={<ChildrenOrderDetailsScreen selectedItems={selectedItems} nextPage="/children-dine-option" />} 
                />
                <Route 
                    path="/children-dine-option" 
                    element={<ChildrenDineOptionScreen nextPage="/children-payment-method" />} 
                />
                <Route 
                    path="/children-payment-method" 
                    element={<ChildrenPaymentMethodScreen />} 
                />
                <Route 
                    path="/children-card-payment" 
                    element={<ChildrenCardPaymentScreen nextPage="/children-payment-completion" />} 
                />
                <Route 
                    path="/children-barcode-scanner" 
                    element={<ChildrenBarcodeScannerScreen nextPage="/children-payment-completion" />} 
                />
                <Route 
                    path="/children-payment-completion" 
                    element={<ChildrenPaymentCompletionScreen />} 
                />
            </Routes>
        </Router>
    );
}

export default App;
