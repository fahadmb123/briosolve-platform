import React from 'react';
import { ServiceAreaRadius } from '../../../../components/ServiceAreaRadius';

interface LocationProps {
    onManageAddresses?: () => void;
}

export const Location: React.FC<LocationProps> = ({ onManageAddresses }) => {
    return <ServiceAreaRadius onManageAddress={onManageAddresses} />;
};
