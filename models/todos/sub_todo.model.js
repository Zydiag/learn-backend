import mongoose from 'mongoose';

const subTodoSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const SubTodo = mongoose.model('SubTodo', subTodoSchema);
