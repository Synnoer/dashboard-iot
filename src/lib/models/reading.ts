import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  deviceId: String,
  timestamp: Number,
  uptime: Number,

  group1: {
    voltage: Number,
    current: Number,
    power: Number,
    connected: Boolean,
    lampCount: Number,
    description: String,
    relayPin: Number,
  },

  group2: {
    voltage: Number,
    current: Number,
    power: Number,
    connected: Boolean,
    lampCount: Number,
    description: String,
    relayPin: Number,
  },

  sensors: {
    ldr: Number,
    pir1: Boolean,
    pir2: Boolean,
  },

  status: {
    relay1: Boolean,
    relay2: Boolean,
    group1Active: Boolean,
    group2Active: Boolean,
    totalLampsOn: Number,
    isDark: Boolean,
  },

  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export const Reading = mongoose.models.Reading || mongoose.model('Reading', readingSchema);
