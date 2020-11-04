import React, { useState, useEffect } from 'react';

export default (props) => {
    const id = props.match.params.id;
    const [postData, setData] = useState({
        isLoading: false,
        error: null,
        post: null
    });

useEffect(()=>{
    setData(prevState => ({...prevState, isLoading: true}));
    setTimeout(()=>{
       fetch('http://localhost:8080/users/' + id)
        .then(res => res.json())
        .then(post => {
          setData((prevState)=>({
            ...prevState,
            isLoading: false,
            post
          }));
      })
      .catch(e => {
        setData((prevState)=>({
          ...prevState,
          isLoading: false,
          error: e
        }))
      })
    }, 500)
  }, []);
  
  const {isLoading, error, post} = postData;
  
  return  (
    <>
    {isLoading && 'Loading....'}
    {!isLoading && !error &&
        (post != null
          ? <CertainPost post={post} key={post.id}/>
          : 'Empty list')
    }
    {!isLoading && error && 'Error happens'}
    </>
  );
}

function CertainPost({post}){
  return (
    <div>
      <b style={{color: "brown", fontSize: 14, marginTop: 15}}>Title</b><br />
      <b style={{fontSize: 12}}>{post.id}</b><br />
      <b style={{color: "brown", fontSize: 14, marginTop: 15}}>Body</b><br />
      <b style={{fontSize: 12}}>{post.id}</b><br />
      <a href={'/posts'} style={{fontSize: 10, color: "blue", float: "right", margin: -3}}>Back to post list</a>
    </div>
  )
}