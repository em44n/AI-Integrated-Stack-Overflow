import supertest from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app';
import * as util from '../models/application';
import { Answer, Question, Tag } from '../types';

const getQuestionsByOrderSpy: jest.SpyInstance = jest.spyOn(util, 'getQuestionsByOrder');
const filterQuestionsBySearchSpy: jest.SpyInstance = jest.spyOn(util, 'filterQuestionsBySearch');
// const translateQuestionsSpy: jest.SpyInstance = jest.spyOn(util, 'translateQuestionsAPICall');

const tag1: Tag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
  description: 'tag1 description',
};
const tag2: Tag = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'tag2',
  description: 'tag2 description',
};

const ans1: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'Answer 1 Text',
  ansBy: 'answer1_user',
  ansDateTime: new Date('2024-06-09'), // The mock date is string type but in the actual implementation it is a Date type
  comments: [],
};

const ans2: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'Answer 2 Text',
  ansBy: 'answer2_user',
  ansDateTime: new Date('2024-06-10'),
  comments: [],
};

const ans3: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'Answer 3 Text',
  ansBy: 'answer3_user',
  ansDateTime: new Date('2024-06-11'),
  comments: [],
};

const ans4: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'Answer 4 Text',
  ansBy: 'answer4_user',
  ansDateTime: new Date('2024-06-14'),
  comments: [],
};

const MOCK_QUESTIONS: Question[] = [
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    askedBy: 'question1_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question1_user', 'question2_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new mongoose.Types.ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3],
    askedBy: 'question2_user',
    askDateTime: new Date('2024-06-04'),
    views: ['question1_user', 'question2_user', 'question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
  {
    _id: new mongoose.Types.ObjectId('34e9b58910afe6e94fc6e99f'),
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    askedBy: 'question3_user',
    askDateTime: new Date('2024-06-03'),
    views: ['question3_user'],
    upVotes: [],
    downVotes: [],
    comments: [],
  },
];

const EXPECTED_QUESTIONS = MOCK_QUESTIONS.map(question => ({
  ...question,
  _id: question._id?.toString(), // Converting ObjectId to string
  tags: question.tags.map(tag => ({ ...tag, _id: tag._id?.toString() })), // Converting tag ObjectId
  answers: question.answers.map(answer => ({
    ...answer,
    _id: answer._id?.toString(),
    ansDateTime: (answer as Answer).ansDateTime.toISOString(),
  })), // Converting answer ObjectId
  askDateTime: question.askDateTime.toISOString(),
}));

describe('GET /getQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return the result of filterQuestionsBySearch as response even if request parameters of order and search are absent', async () => {
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    filterQuestionsBySearchSpy.mockReturnValueOnce(MOCK_QUESTIONS);
    // Making the request
    const response = await supertest(app).get('/question/getQuestion');

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_QUESTIONS);
  });

  it('should return the result of filterQuestionsBySearch as response for an order and search criteria in the request parameters', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    filterQuestionsBySearchSpy.mockReturnValueOnce(MOCK_QUESTIONS);
    // Making the request
    const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_QUESTIONS);
  });

  it('should return error if getQuestionsByOrder throws an error', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getQuestionsByOrderSpy.mockRejectedValueOnce(new Error('Error fetching questions'));
    // Making the request
    const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return error if filterQuestionsBySearch throws an error', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    filterQuestionsBySearchSpy.mockRejectedValueOnce(new Error('Error filtering questions'));
    // Making the request
    const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(500);
  });
});

describe('POST /translateQuestions', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  // commented out because successful translation case has not been implemented yet!
  // it('should return 200 if translateQuestions successfully translates', async () => {
  //   // Mock request query parameters
  //   const mockReqBody = {
  //     ids: ['1', '2', '3', '4'],
  //     language: 'Spanish',
  //   };
  //   // translateQuestionsAPICallSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
  //   const response = await supertest(app).post('/question/translateQuestions').send(mockReqBody);
  //   expect(response.status).toBe(200);
  // });

  it('should return error if translateQuestions throws an error', async () => {
    // Mock request query parameters
    const mockReqBody = {
      ids: ['1', '2', '3', '4'],
      language: 'German',
    };
    // translateQuestionsAPICallSpy.mockRejectedValueOnce(some Error);
    const response = await supertest(app).post('/question/translateQuestions').send(mockReqBody);
    expect(response.status).toBe(500);
  });

  it('should return 400 if translateQuestions request body is missing a language', async () => {
    // Mock request query parameters
    const mockReqBody = {
      ids: ['1', '2', '3', '4'],
    };
    // translateQuestionsAPICallSpy.mockRejectedValueOnce(some Error);
    const response = await supertest(app).post('/question/translateQuestions').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('No language');
  });

  it('should return 400 if translateQuestions request body is missing ids', async () => {
    // Mock request query parameters
    const mockReqBody = {
      language: 'Portuguese',
    };
    // translateQuestionsAPICallSpy.mockRejectedValueOnce(some Error);
    const response = await supertest(app).post('/question/translateQuestions').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('No question IDs');
  });

  it('should return 400 if translateQuestions request body has empty list of ids', async () => {
    // Mock request query parameters
    const mockReqBody = {
      ids: [],
      language: 'Vietnamese',
    };
    // translateQuestionsAPICallSpy.mockRejectedValueOnce(some Error);
    const response = await supertest(app).post('/question/translateQuestions').send(mockReqBody);
    expect(response.status).toBe(400);
    expect(response.text).toBe('No question IDs');
  });

  it('should return error if translateQuestions throws an error', async () => {
    // Mock request query parameters
    const mockReqBody = {
      ids: ['1', '2', '3', '4'],
      language: 'English',
    };
    // translateQuestionsAPICallSpy.mockRejectedValueOnce(some Error);
    const response = await supertest(app).post('/question/translateQuestions').send(mockReqBody);
    expect(response.status).toBe(500);
  });
});
