export const userPostFetch = user => {
    return dispatch => {
        return fetch("http://localhost:8080/api/v1/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                email : "test@test.com",
                password: "test1"
            })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.message) {
                    //Тут прописываем логику
                } else {
                    localStorage.setItem("token", data.jwt)
                    dispatch(loginUser(data.user))
                }
            })
    }
};

const loginUser = userObj => ({
    type: 'LOGIN_USER',
    payload: userObj
});