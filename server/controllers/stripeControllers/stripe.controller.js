const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const paymentService = require('../../services/paymentServices/payment.service');

async function createPaymentIntent(req, res) {
  try {
    const { order_id, amount } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Order ID and amount are required' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        order_id: order_id,
        employee_id: req.body.employee_id || 'unknown'
      },
      description: `Payment for Order #${order_id}`
    });

    res.status(200).json({
      status: 'success',
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ 
      status: 'fail', 
      message: err.message || 'Failed to create payment intent' 
    });
  }
}

async function confirmPayment(req, res) {
  try {
    const { paymentIntentId, order_id, amount, notes, paymentMethodId } = req.body;

    if (paymentMethodId) {
      try {
        const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
          payment_method: paymentMethodId
        });

        if (confirmedIntent.status !== 'succeeded') {
          return res.status(400).json({
            status: 'fail',
            message: `Payment status: ${confirmedIntent.status}`
          });
        }
      } catch (stripeErr) {
        console.error('Stripe confirmation error:', stripeErr);
        return res.status(400).json({
          status: 'fail',
          message: stripeErr.message || 'Payment confirmation failed'
        });
      }
    } else {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          status: 'fail',
          message: `Payment status: ${paymentIntent.status}. Please complete the payment.`
        });
      }
    }

    const payment = await paymentService.createPayment({
      order_id,
      amount,
      payment_method: 'card',
      payment_status: 'completed',
      notes: `Stripe Payment - ${notes || 'Card payment'} - Intent: ${paymentIntentId}`,
      stripe_payment_id: paymentIntentId
    });

    res.status(201).json({
      status: 'success',
      data: payment,
      message: 'Payment processed successfully and recorded'
    });
  } catch (err) {
    console.error('Payment confirmation error:', err);
    res.status(500).json({
      status: 'fail',
      message: err.message || 'Failed to confirm payment'
    });
  }
}

async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!endpointSecret) {
      console.log('Webhook received (no secret configured)');
      return res.json({ received: true });
    }

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('✓ Payment succeeded:', paymentIntent.id);
    console.log('  Amount:', paymentIntent.amount / 100, paymentIntent.currency.toUpperCase());
    console.log('  Order ID:', paymentIntent.metadata.order_id);
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    console.log('✗ Payment failed:', paymentIntent.id);
  }

  res.json({ received: true });
}

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleWebhook
};
