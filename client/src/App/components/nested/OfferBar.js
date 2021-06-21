import { useState } from "react";
import CurrencyInput from 'react-currency-input-field';

import '../../assets/styles/OfferBar.scss'

const OfferBar = (props) => {
    const [offerPrice, setOfferPrice] = useState(0);
    const [className, setClassName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const prefix = "S$";

    const handleOnValueChange = value => {
        if (!value) {
          setClassName('');
          setOfferPrice(0);
          return;
        }
    
        if (Number.isNaN(Number(value))) {
          setErrorMessage('Please enter a valid number');
          setClassName('is-invalid');
          return;
        }
    
        if (Number(value) < 0) {
          setErrorMessage(`Min: ${prefix}0`);
          setClassName('is-invalid');
          setOfferPrice(value);
          return;
        }
    
        setClassName('is-valid');
        setOfferPrice(value);
    };

    const makeOffer = () => {
        if (offerPrice <= 0) return
        // call api to make offer
    }

    return (
        <div>
            <CurrencyInput
                className={`offer-input ${className}`}
                decimalsLimit={2}
                allowNegativeValue={false}
                placeholder="Amount to offer"
                defaultValue={0}
                prefix={prefix}
                onValueChange={handleOnValueChange}
            />
            <button onClick={makeOffer}>Offer</button>
            <p>{errorMessage}</p>
        </div>
    );
}

export default OfferBar;