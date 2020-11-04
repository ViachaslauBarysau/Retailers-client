import React, { useState, useEffect } from 'react';

export default () => {
    const [billsData, setData] = useState({
        isLoading: false,
        error: null,
        bills: null
    });

useEffect(()=>{
    setData(prevState => ({...prevState, isLoading: true}));
       fetch('http://localhost:8080/bills/')
        .then(res => res.json())
        .then(bills => {
          setData((prevState)=>({
            ...prevState,
            isLoading: false,
            bills
          }));
      })
      .catch(e => {
        setData((prevState)=>({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
  }, []);
  
  const {isLoading, error, bills} = billsData;
  
  return  (
    <>
    {isLoading && 'Loading....'}
    {!isLoading && !error &&
        (bills != null
          ? bills.map(bill => <Bills bill={bill} key={bill.id}/>)
          : 'Empty list')
    }
    {!isLoading && error && 'Error happens'}
    </>
  );
}

function Bills({bill}){
  return (
    <div style={{marginTop: 10}}>
      <li>{bill.id}</li>
      <a href={'/bills/' + bill.id} style={{fontSize: 10, color: "blue", float: "right", marginRight: 5, marginTop: -5}}>Read more</a>
      <hr />
    </div>
  )
}