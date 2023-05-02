module.exports = {
    forbidden: [
      {
        name: 'circular',
        severity: 'error',
        comment: 'Circular dependency detected',
        from: {},
        to: {
          circular: true
        }
      }
    ]
  };
  