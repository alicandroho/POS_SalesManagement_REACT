import React from 'react';
import { Link } from 'react-router-dom';

interface ViewTransactionLinkProps {
    transactionid: string;
}

const ViewTransactionLink: React.FC<ViewTransactionLinkProps> = ({ transactionid }) => {
  return (
    <Link to={`/transactions/${transactionid}`}>
        <button className='btn btn-success btn-lg'
            style={{
                marginRight: 5,
                fontSize: 15,
                fontWeight: 'medium'
            }}
        >
        View
        </button>
    </Link>
  );
};

export default ViewTransactionLink;
