import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

test("testing with string as noOfTickets should fail", () => {
  expect(() => {
    new TicketTypeRequest('ADULT','string')
  }).toThrow('noOfTickets must be an positive integer');
});

test("testing with negative noOfTickets should fail", () => {
  expect(() => {
    new TicketTypeRequest('ADULT',-1)
  }).toThrow('noOfTickets must be an positive integer');
});

test("testing with 0 noOfTickets should fail", () => {
  expect(() => {
    new TicketTypeRequest('ADULT',0)
  }).toThrow('noOfTickets must be an positive integer');
});

test("ticket type must be valid", () => {
  expect(() => {
    new TicketTypeRequest('string',1)
  }).toThrow('type must be ADULT, CHILD, or INFANT');
});

test("getNoOfTickets must return the correct noOfTickets", () => {
  const ticketTypeRequest = new TicketTypeRequest('ADULT',2)

  expect(ticketTypeRequest.getNoOfTickets()).toBe(2);
});

test("getTicketType must return the correct type", () => {
  const ticketTypeRequest = new TicketTypeRequest('ADULT',2)

  expect(ticketTypeRequest.getTicketType()).toBe('ADULT');
});