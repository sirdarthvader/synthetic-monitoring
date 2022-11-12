const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
  totalSuites: {
    type: Number,
    require: true,
  },
  totalTests: {
    type: Number,
    require: true,
  },
  totalFailed: {
    type: Number,
    require: true,
  },
  totalPassed: {
    type: Number,
    require: true,
  },
  totalPending: {
    type: Number,
    require: true,
  },
  totalSkipped: {
    type: Number,
    require: true,
  },
  duration: {
    startedAt: {
      type: Date,
      require: true,
    },
    endedAt: {
      type: Date,
      require: true,
    },
    totalDuration: {
      type: Number,
      require: true,
    },
  },
  tests: [
    {
      title: {
        type: String,
        trim: true,
        require: true,
      },
      state: {
        type: String,
        enum: ['passed', 'failed'],
      },
      videoLink: {
        type: String,
        require: true,
      },
      testBody: {
        type: String,
        trim: true,
      },
    },
  ],
});

module.exports = mongoose.model('TestResults', TestResultSchema);
