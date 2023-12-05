const mongoose = require('mongoose');

const Model = mongoose.model('Offer');

const custom = require('@/controllers/middlewaresControllers/pdfController');

const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');

const create = async (req, res) => {
  const { items = [], taxRate = 0, discount = 0 } = req.body;

  // default
  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;
  // let credit = 0;

  //Calculate the items array with subTotal, total, taxTotal
  items.map((item) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    //sub total
    subTotal = calculate.add(subTotal, total);
    //item total
    item['total'] = total;
  });
  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

  let body = req.body;

  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = items;
  body['createdBy'] = req.admin._id;

  // Creating a new document in the collection
  const result = await new Model(body).save();
  const fileId = 'offer-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  increaseBySettingKey({ settingKey: 'last_offer_number' });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Offer created successfully',
  });
};
module.exports = create;