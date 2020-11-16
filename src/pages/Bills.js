import BillModal from '../modals/BillModal';
import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

export default () => {
  const [billsData, setData] = useState({
    isLoading: false,
    error: null,
    bills: [],
    displayModal: false
  });

  useEffect(() => {
    setData(prevState => ({ ...prevState, isLoading: true }));
    fetch('http://localhost:8080/bills', {
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

  const { isLoading, error, bills, displayModal } = billsData;

  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        (bills.length != 0
          ? bills.map(bill => <Bills bill={bill} key={bill.id} />)
          : 'Empty list')
      }
      {!isLoading && error && 'Error happens'}
      <Button onClick={() => setData((prevState) => ({
        ...prevState,
        displayModal: true
      }))}>
        Add bill
      </Button>
      {displayModal && <BillModal onClick={() => setData((prevState) => ({ ...prevState, displayModal: false }))} />}
    </>
  );
}

function Bills({ bill }) {
  return (
    <p><label><input type="checkbox" value={bill.id} name={"users"} />
      <span>{bill.billNumber} {bill.totalProductAmount} -  {bill.totalUnitNumber}  - {bill.registrationDateTime}</span></label></p>
  )
}