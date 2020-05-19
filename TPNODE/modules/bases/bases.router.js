var express = require('express');
const BM = require("./bases.middleware");
var router = express.Router();

router.param("baseId", BM.baseIdParam);
router.param("tableId", BM.tableIdParam);
router.param("lineId", BM.lineIdParam);
router.param("columnId", BM.columnIdParam);

router.route("/")
    .get(BM.getBases)
    .post(BM.newBase);

router.route('/:baseId')
    .get(BM.getBase)
    .put(BM.updateBase, BM.getBase)
    .delete(BM.deleteBase);

router.route('/:baseId/table')
    .post(BM.addTable);

router.route('/:baseId/:tableId')
    .get(BM.getTable);

router.route('/:baseId/:tableId/data-selectors')
    .get(BM.getDataSelectors);

router.route('/:baseId/:tableId/column')
    .post(BM.addColumn);

router.route('/:baseId/:tableId/column/:columnId')
    .put(BM.updateColumn);

router.route('/:baseId/:tableId/data')
    .get(BM.getData);

router.route('/:baseId/:tableId/data/line')
    .post(BM.testValidity, BM.setLine, BM.addDataline);

router.route('/:baseId/:tableId/data/line/:lineId')
    .put(BM.testValidity, BM.updateLine)
    .delete(BM.deleteLine);

router.route('/line/:lineId/label')
    .get(BM.getLabelRelation);

module.exports = router;
