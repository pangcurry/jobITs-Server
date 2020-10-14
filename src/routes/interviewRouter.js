const express = require('express');

const Interviews = require('../models/interviews');
const Interview = require('../services/interview');
const interview = new Interview(Interviews);

const router = express.Router();

const { badRequest } = require('../errors');

router.get('/', async (req, res) => {
  try {
    if(!Object.keys(req.query).length) {
      throw badRequest;
    }
    const page = parseInt(req.query.page);
    // field 값이 없다면 모든 field를 가져올 수 있게 하기 위해 false를 대입
    // mysql의 모든 문자열은 boolean으로 바꾸면 false이다.
    const field = req.query.field ? req.query.field : false;
    const keyword = req.query.keyword ? req.query.keyword : '';
    const maxShow = 6;
    
    const results = await interview.getInterviewQuestions(page, field, keyword, maxShow);
    res.send({
      lists: results,
      field: field
    });
  } catch (error) {
    res.status(error.status).send({
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      throw badRequest;
    }
    const { contents, field } = req.body;
    
    await interview.registerInterviewQuestions(contents, field);
    res.status(201).send();
  } catch (error) {
    res.status(error.status).send({
      message: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!Object.keys(req.body).length) {
      throw badRequest;
    }
    const { content, field } = req.body;
    const id = parseInt(req.params.id);
    
    await interview.modifyInterviewQuestion(id, content, field);
    res.send();
  } catch (error) {
    res.status(error.status).send({
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await interview.removeInterviewQuestion(id);
    res.send();
  } catch (error) {
    res.status(error.status).send({
      message: error.message
    });
  }
});

module.exports = router;