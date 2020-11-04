import React, { useState, useEffect } from 'react';

export default () => {
    const [actsData, setData] = useState({
        isLoading: false,
        error: null,
        acts: null
    });

useEffect(()=>{
    setData(prevState => ({...prevState, isLoading: true}));
       fetch('http://localhost:8080/writeoffacts/')
        .then(res => res.json())
        .then(acts => {
          setData((prevState)=>({
            ...prevState,
            isLoading: false,
            acts
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
  
  const {isLoading, error, acts} = actsData;
  
  return  (
    <>
    {isLoading && 'Loading....'}
    {!isLoading && !error &&
        (acts != null
          ? acts.map(act => <Acts act={act} key={act.id}/>)
          : 'Empty list')
    }
    {!isLoading && error && 'Error happens'}
    </>
  );
}

function Acts({act}){
  return (
    <div style={{marginTop: 10}}>
      <li>{act.id}</li>
      <a href={'/acts/' + act.id} style={{fontSize: 10, color: "blue", float: "right", marginRight: 5, marginTop: -5}}>Read more</a>
      <hr />
    </div>
  )
}