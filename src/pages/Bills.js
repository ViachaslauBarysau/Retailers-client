import BillModal from '../modals/BillModal';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import UpperProductModal from '../modals/upperModals/UpperProductModal';

export default () => {
  const [billsData, setData] = useState({
    isLoading: false,
    error: null,
    bills: [],
    displayModal: false,
    displayUpperModal: false
  });

  useEffect(() => {
    setData(prevState => ({ ...prevState, isLoading: true }));
    fetch('http://localhost:8080/api/bills', {
      headers: {
        "Authorization": localStorage.getItem("token")
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(bills => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          bills
        }));
      })
      .catch(e => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
  }, []);

  const { isLoading, error, bills, displayModal, displayUpperModal } = billsData;

  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        (bills.length != 0
          ? <table border="1">
            <tr>
              <th>Bill number</th>
              <th>Total amount of items</th>
              <th>Total sum of items</th>
              <th>Date and Time</th>
            </tr>
            {bills.map(bill => <Bills bill={bill} key={bill.id} />)}
          </table>
          : 'Empty list')
      }
      <br />
      {!isLoading && error && 'Error happens'}
      <Button onClick={() => setData((prevState) => ({
        ...prevState,
        displayModal: true
      }))}>
        Add bill
      </Button>
      {displayModal && <BillModal onCloseModal={() => setData((prevState) => ({ ...prevState, displayModal: false }))}
        onCloseUpperModal={() => setData((prevState) => ({ ...prevState, displayUpperModal: false }))}
        onOpenUpperModal={() => setData((prevState) => ({ ...prevState, displayUpperModal: true }))} />}
      {displayUpperModal && <UpperProductModal
        onCloseUpperModal={() => setData((prevState) => ({ ...prevState, displayUpperModal: false }))} />}
    </>
  );
}

function Bills({ bill }) {
  return (
    <tr id={bill.id}>
      <td>{bill.billNumber}</td>
      <td>{bill.totalProductAmount}</td>
      <td>{bill.totalUnitNumber}</td>
      <td>{bill.registrationDateTime}</td>
    </tr>
  )
}