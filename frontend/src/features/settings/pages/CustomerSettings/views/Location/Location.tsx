import React from 'react';
import { ServiceAreaRadius } from '../../../../components/customer/CustomerServiceAreaRadius';

interface LocationProps {
    onManageAddresses?: () => void;
}

export const Location: React.FC<LocationProps> = ({ onManageAddresses }) => {
    return <ServiceAreaRadius onManageAddress={onManageAddresses} />;
};
