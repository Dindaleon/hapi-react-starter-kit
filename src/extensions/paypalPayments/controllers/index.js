import payments from './functions';
let paymentController = [];
if (__SERVER__) {
  const Joi = require('joi');
  paymentController = [
    /**
     * Create Payment
     */
    {
      method: 'POST',
      path: '/payments/create',
      config: {
        tags: [ 'api', 'payments', 'create' ],
        description: 'Create a Paypal Payment',
        validate: {
          headers: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          payload: {
            userId: Joi.number().integer().required(),
            amount: Joi.number().min(1).required()
          }
        }
      },
      handler: ( request, reply ) => {
        payments.create( request, result => {
          if ( result !== null ) {
            reply({
              statusCode: 200,
              message: 'Payment Created Successfully.',
              data: result

            }).code(200);
          } else {
            reply({
              statusCode: 500,
              message: 'Something Bad Happened.',
              error: '500: Error creating payment.'
            }).code(500);
          }
        });
      }
    },
    /**
     * Cancel Payment
     */
    {
      method: 'POST',
      path: '/payments/cancel',
      config: {
        tags: [ 'api', 'payments', 'cancel' ],
        description: 'Cancel a Paypal Payment',
      },
      handler: ( request, reply ) => {
        payments.create( request, result => {
          if ( reply !== null ) {
            reply({
              statusCode: 200,
              message: 'Payment Cancelled Successfully.',
              data: result

            }).code(200);
          } else {
            reply({
              statusCode: 500,
              message: 'Something Bad Happened.',
              error: '500: Payment cannot be cancelled.'
            }).code(500);
          }
        });
      }
    },
    /**
     * Execute Payment
     */
    {
      method: 'POST',
      path: '/payments/execute',
      config: {
        tags: [ 'api', 'payments', 'execute' ],
        description: 'Execute a Paypal Payment',
        validate: {
          headers: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          payload: {
            userId: Joi.number().required(),
            payerID: Joi.string().required(),
            paymentId: Joi.string().required()
          }
        }
      },
      handler: ( request, reply ) => {
        payments.execute( request, result => {
          if ( result !== null && result.status === 'approved' ) {
            reply({
              statusCode: 200,
              message: 'Payment Has Been Approved.',
              data: result
            }).code(200);
          } else if ( result !== null && result.statusCode === 400 ) {
            reply({
              statusCode: 400,
              message: 'Bad Request.',
              error: '400: Payment has already been executed.'
            }).code(400);
          } else if ( result !== null && result.statusCode === 404 ) {
            reply({
              statusCode: 404,
              message: 'Not Found',
              error: '404: Payment not found.'
            }).code(404);
          } else {
            reply({
              statusCode: 500,
              message: 'Something Bad Happened.',
              error: '500: Error executing payment.'
            }).code(500);
          }
        });
      }
    },
    /**
     * Get User Payment Data
     */
    {
      method: 'GET',
      path: '/users/{id}/payments',
      config: {
        tags: [ 'api', 'user', 'payments' ],
        description: 'Get user payment data.',
        validate: {
          headers: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          params: {
            id: Joi.number()
              .integer()
              .required()
              .description('User\'s id')
          }
        }
      },
      handler: ( request, reply ) => {
        payments.getUserPaymentData( request, result => {
          if ( result !== null ) {
            reply({
              statusCode: 200,
              message: 'User Payment Data Loaded Successfully.',
              data: result

            }).code(200);
          } else {
            reply({
              statusCode: 500,
              message: 'Something Bad Happened.',
              error: '500: Error loading user payment data.'
            }).code(500);
          }
        });
      }
    },
    /**
     * Create Payouts
     */
    {
      method: 'POST',
      path: '/payments/payouts',
      config: {
        tags: [ 'api', 'payments', 'payouts' ],
        description: 'Create a Paypal Payment Payout',
        validate: {
          headers: Joi.object({
            authorization: Joi.string().required()
          }).unknown(),
          payload: {
            userId: Joi.number().integer().required(),
            amount: Joi.number().min(1).required()
          }
        }
      },
      handler: ( request, reply ) => {
        payments.createPayouts( request, result => {
          if ( result !== null && result.status === 'completed' ) {
            reply({
              statusCode: 200,
              message: 'Payment Payout Created Successfully.',
              data: result

            }).code(200);
          } else if ( result !== null && result.status === 'unclaimed' ) {
            reply({
              statusCode: 200,
              message: 'Payment Payout Was Unsuccessfull.',
              data: result

            }).code(200);
          } else if ( result !== null && result.status === 'insufficient funds' ) {
            reply({
              statusCode: 200,
              message: 'Payment Payout Was Unsuccessfull because of insufficient funds.',
              data: result
            }).code(200);
          } else {
            reply({
              statusCode: 500,
              message: 'Something Bad Happened.',
              error: '500: Error creating payment payout.'
            }).code(500);
          }
        });
      }
    },
  ];
}
export { paymentController as default };
