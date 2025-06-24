import mongoose, { Schema, Document } from 'mongoose';

// Interface representing the structure of a single reading document
export interface IReading extends Document {
  sensor_id: string;
  timestamp: number;
  pir1_status: number;
  pir2_status: number;
  relay1_status: number;
  relay2_status: number;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  createdAt: Date;
}

// Mongoose schema that directly matches the flat JSON payload from the ESP32
const readingSchema = new Schema<IReading>({
  // Use `sensor_id` to match the field name from the ESP32
  sensor_id: {
    type: String,
    required: [true, 'Sensor ID is required.'],
    index: true, // Index this field for faster queries
  },
  
  // Device's own timestamp (from millis())
  timestamp: { 
    type: Number, 
    required: true 
  }, 

  // --- Sensor and Relay States (as numbers, 0 or 1) ---
  pir1_status: { type: Number, required: true, default: 0 },
  pir2_status: { type: Number, required: true, default: 0 },
  relay1_status: { type: Number, required: true, default: 0 },
  relay2_status: { type: Number, required: true, default: 0 },

  // --- Power Metrics from PZEM-004T ---
  // The ESP32 sends NaN on error, which becomes null in JSON.
  // Setting a default of 0 is a safe practice for storing in the DB.
  voltage: { type: Number, required: true, default: 0 },
  current: { type: Number, required: true, default: 0 },
  power: { type: Number, required: true, default: 0 },
  energy: { type: Number, required: true, default: 0 },

  // --- Server-side timestamp for record creation ---
  createdAt: {
    type: Date,
    default: () => new Date(),
    index: true, // Index for sorting by time efficiently
  },
});

// The || pattern prevents model recompilation in Next.js hot-reload/dev mode
export const Reading = mongoose.models.Reading || mongoose.model<IReading>('Reading', readingSchema);