import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store/store';
import { ACTORS_URL } from '../API'

import { Actor, ActorDetails, ErrorI } from '../interfaces/index'

interface ActorState {
    actor: ActorDetails | null,
    actors: ActorDetails[] | null,
    loading: boolean,
    errors: any,
    getActorStatus: string,
    addActorStatus: string,
    updateActorStatus: string,
    deleteActorStatus: string,
    searchActorStatus: string,

}

const initialState: ActorState = {
    actor: null,
    actors: [],
    loading: false,
    errors: "",
    getActorStatus: "",
    addActorStatus: "",
    updateActorStatus: "",
    deleteActorStatus: "",
    searchActorStatus:""
}

export const getActors = createAsyncThunk<ActorDetails[]>(
    "actors/getActors",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(ACTORS_URL)
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)


export const getActor = createAsyncThunk<ActorDetails, string | undefined>(
    "actors/getActor",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(ACTORS_URL + id)

            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)



export const addActor = createAsyncThunk<ActorDetails, Object>(
    "actors/addActor",
    async (data, { rejectWithValue }) => {
        try {

            const response = await axios.post(ACTORS_URL, data)
            return response.data
        } catch (error: unknown) {
            if (error) {
                let message: ErrorI = error
                return rejectWithValue(message.response?.data?.error?.message)
            }
            else {
                return rejectWithValue(error)
            }
        }
    }
)

export const updateActor = createAsyncThunk<Object, Actor>(
    "actors/updateActor",
    async (data, thunkAPI) => {
        try {
            const { id, firstName, lastName, gender, age, imageURL } = data
            const response = await axios.patch(ACTORS_URL + id, { firstName, lastName, gender, age, imageURL })
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const deleteActor = createAsyncThunk<{ id: string }, string>(
    "actors/deleteActor",
    async (data:string, thunkAPI) => {
        try {

            const response = await axios.delete(ACTORS_URL + data)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const searcheActors = createAsyncThunk(
    "actors/searcheActors",
    async (name: string, thunkAPI) => {
        try {
            const response = await axios.get(ACTORS_URL + name)
            return response.data

        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
  );



export const actorSlice = createSlice({
    name: "actors",
    initialState,
    reducers: {
        setActors: (state = initialState, action: PayloadAction<ActorDetails[]>) => {
            state.actors = action.payload;
        },

        setActor: (state = initialState, action: PayloadAction<Actor>) => {
            state.actor = action.payload;
        },

    },

    extraReducers: (builder) => {
        builder.addCase(getActors.pending, (state = initialState) => {
            state.loading = true;
            state.getActorStatus = "pending"

        });
        builder.addCase(getActors.fulfilled, (state = initialState, action: PayloadAction<ActorDetails[]>) => {
            state.actors = action.payload;
            state.loading = false;
            state.getActorStatus = "fullfilled"
        });

        builder.addCase(getActors.rejected, (state = initialState) => {
            state.loading = false;
            state.getActorStatus = "rejected"
        });

        builder.addCase(getActor.pending, (state = initialState) => {
            state.loading = true;
            state.getActorStatus = "pending"

        });
        builder.addCase(getActor.fulfilled, (state = initialState, action: PayloadAction<Actor>) => {
            state.actor = action.payload;
            state.loading = false;
            state.getActorStatus = "fullfilled"
        });

        builder.addCase(getActor.rejected, (state = initialState) => {
            state.loading = false;
            state.getActorStatus = "rejected"
        });

        builder.addCase(updateActor.pending, (state = initialState) => {
            state.loading = true;
            state.updateActorStatus = "pending"

        });
        builder.addCase(updateActor.fulfilled, (state = initialState) => {  
             state.loading = false;
            state.updateActorStatus = "fullfilled"

        });
        builder.addCase(updateActor.rejected, (state = initialState) => { 
            state.loading = false;
            state.updateActorStatus = "rejected"
        });

        builder.addCase(deleteActor.pending, (state = initialState) => {
            state.loading = true;
            state.deleteActorStatus = "pending"

        });
        builder.addCase(deleteActor.fulfilled, (state = initialState) => {
            state.loading = false;
            state.deleteActorStatus = "fullfilled"
        });
        builder.addCase(deleteActor.rejected, (state = initialState) => {         
            state.loading = false;
            state.deleteActorStatus = "rejected"
        });

        builder.addCase(searcheActors.pending, (state = initialState) => {
            state.loading = true;
            state.searchActorStatus = "pending"

        });
        builder.addCase(searcheActors.fulfilled, (state = initialState,action) => {
            state.actors = action.payload;
            state.loading = false;
            state.searchActorStatus = "fullfilled"
        });
        builder.addCase(searcheActors.rejected, (state = initialState, action) => {         
            state.loading = false;
            state.searchActorStatus = "rejected"
            state.errors = action.payload
        });


    }
})


export default actorSlice.reducer;
export const actorDetails = (state: RootState) => state.actors.actors;
export const actorState = (state: RootState) => state.actors;
export const { setActors, setActor } = actorSlice.actions // get actors and actor