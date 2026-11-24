import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api/tasks";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

// GET tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    const response = await axios.get(API, { headers: getHeaders() });
    return response.data;
  }
);

// ADD task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (task) => {
    const response = await axios.post(API, task, {
      headers: getHeaders()
    });
    return response.data;
  }
);

// UPDATE task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, task }) => {
    const response = await axios.put(`${API}/${id}`, task, {
      headers: getHeaders()
    });
    return response.data;
  }
);

// DELETE task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id) => {
    await axios.delete(`${API}/${id}`, {
      headers: getHeaders()
    });
    return id;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload
        );
      });
  }
});

export default taskSlice.reducer;