const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
    shopId: '269970',
    secretKey: 'test_YEwiwBH3xmrzNTYf19daMHSElKGjtQPJL0CPVtt-TqQ'
});

const paymentsDebug = true;

const awaitPayment = async (payment) => 
{
    if (paymentsDebug) console.log('waiting...');
    let time = Number(0);
    
    while (payment.isPending || (payment.isWaitingForCapture)) 
    {
        if (paymentsDebug) 
        {
            if(payment.isPending) console.log(`pending. ${time} seconds awaited.`);
            else console.log(`waiting for capture. ${time} seconds awaited.`);
            time++;
        }
        await payment.reload();
        await new Promise(r => setTimeout(r, 1000));
    }
    if (payment.isResolved)
    {
        if (payment.isSucceeded) 
        {
            if (paymentsDebug) console.log('done successfully');
            return true;
        } else 
        {
            if (paymentsDebug) console.log('done with error: ', await payment.reload());
            return false;
        }
    } else console.log('payment pending stopped before resolving')
}

const initPayment = async (val, desc) => 
{
    if (paymentsDebug) console.log('inited payment. val/desc is: ', val, desc);
    
    const payment = await yooKassa.createPayment({
        amount: {
            value: val,
            currency: "RUB"
        },
        payment_method_data: {
            type: "bank_card"
        },
        confirmation: {
            type: "redirect",
            return_url: "http://sneg-info.ru"
        },
        description: desc
    });
    
    if (paymentsDebug) console.log('payment created.');
    
    //_awaitPayment();
    let paymentRef = payment.confirmationUrl;
    if (paymentsDebug) console.log(paymentRef);
    
    return { paymentRef, payment };
    
}

module.exports = { initPayment, awaitPayment }
