import ActModal from './ActModal';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

export default () => {
  const [actsData, setData] = useState({
    isLoading: true,
    error: null,
    acts: null,
    displayModal: false
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/writeoffacts', {
      headers: {
        "Authorization": localStorage.getItem("token")
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(acts => {
        setData((prevState) => ({
          ...prevState,
          isLoading: false,
          acts
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

  const { isLoading, error, acts, displayModal } = actsData;

  return (
    <>
      {isLoading && 'Loading....'}
      {!isLoading && !error &&
        (acts.length != 0
          ? acts.map(act => <Acts act={act} key={act.id} />)
          : 'Empty list')
      }
      {!isLoading && error && 'Error happens'}
      <Button onClick={() => setData({
        ...actsData,
        displayModal: true
      })}>
        Add write-off act
      </Button>
      {displayModal && <ActModal onClick={() => setData({ ...actsData, displayModal: false })} />}
    </>
  );
}

function Acts({ act }) {
  return (
    <p><label><input type="checkbox" value={act.id} name={"acts"} />
      <span>{act.id} - {act.actDateTime}</span></label></p>
  )
}