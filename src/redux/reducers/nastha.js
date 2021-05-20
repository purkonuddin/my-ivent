/* eslint-disable import/no-anonymous-default-export */
const initialState = { 
    postEvent:{
        isFulfilled: false,
        isPending: false,
        isRejected: false,
        rejected: {},
        data:{},
    },
    fetchEvent:{
        isFulfilled: false,
        isPending: false,
        isRejected: false,
        rejected: {},
        data:{},
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'GET_EVENT_PENDING':
            return {
                ...state,
                fetchEvent: {
                    isFulfilled: false,
                    isPending: true,
                    isRejected: false,
                    rejected: {},
                    data:{},
                }
            }
        case 'GET_EVENT_REJECTED':
            return {
                ...state,
                fetchEvent: {
                    isFulfilled: false,
                    isPending: false,
                    isRejected: true,
                    rejected: action.payload.response === undefined
                    ? action.payload.isAxiosError 
                        ? { status: action.payload.request.status, message: "Network to Api's Service is Error" } 
                        : { status: action.payload.request.status, message: action.payload.message }
                    :{
                        status: action.payload.response.status,
                        message: action.payload.response.data.message
                    },
                    data:{},
                }
            }
        case 'GET_EVENT_FULFILLED':
            return {
                ...state,
                fetchEvent: {
                    isFulfilled: true,
                    isPending: false,
                    isRejected: false,
                    rejected: {},
                    data: action.payload.data.result,
                }
            }
        case 'POST_EVENT_PENDING':
            return {
                ...state,
                postEvent: {
                    isFulfilled: false,
                    isPending: true,
                    isRejected: false,
                    rejected: {},
                    data:{},
                }
            }
        case 'POST_EVENT_REJECTED':
            return {
                ...state,
                postEvent: {
                    isFulfilled: false,
                    isPending: false,
                    isRejected: true,
                    rejected: action.payload.response === undefined
                    ? action.payload.isAxiosError 
                        ? { status: action.payload.request.status, message: "Network to Api's Service is Error" } 
                        : { status: action.payload.request.status, message: action.payload.message }
                    :{
                        status: action.payload.response.status,
                        message: action.payload.response.data.message
                    },
                    data:{},
                }
            }
        case 'POST_EVENT_FULFILLED':
            return {
                ...state,
                postEvent: {
                    isFulfilled: true,
                    isPending: false,
                    isRejected: false,
                    rejected: {},
                    data: action.payload.data.result,
                }
            }
        default:
        return state
    }
}