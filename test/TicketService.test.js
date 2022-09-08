import TicketService from '../src/pairtest/TicketService.js'
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

const ticketService = new TicketService

test("Invalid accountId needs to throw error", () => {
  expect(() => {
    ticketService.purchaseTickets('string', [])
  }).toThrow('accountId must be a positive integer');
});

test("accountId can't be negative", () => {
  expect(() => {
    ticketService.purchaseTickets(-1, [])
  }).toThrow('accountId must be a positive integer');
});

test("accountId can't be 0", () => {
  expect(() => {
    ticketService.purchaseTickets(0, [])
  }).toThrow('accountId must be a positive integer');
});

test("populating ticketTypeRequests with anything but array should fail", () => {
  expect(() => {
    ticketService.purchaseTickets(1, 'string')
  }).toThrow('ticketTypeRequests must be an array');
});

test("Can't purchase 0 tickets", () => {
  expect(() => {
    ticketService.purchaseTickets(1, [])
  }).toThrow('At least one ticket is needed to complete the purchase');
});

test("Can't purchase more than 20 tickets", () => {
  let ticketTypeRequests = []
  for (let i = 0; i < 21; i++) {
    ticketTypeRequests.push(new TicketTypeRequest('ADULT',1))
  }
  
  expect(() => {
    ticketService.purchaseTickets(1, ticketTypeRequests)
  }).toThrow('Only a maximum of 20 tickets that can be purchased at a time');
});

test("Can't purchase a child ticket without an adult", () => {
  const ticketTypeRequests = [new TicketTypeRequest('CHILD',1)]
  
  expect(() => {
    ticketService.purchaseTickets(1, ticketTypeRequests)
  }).toThrow('Child or infant tickets cannot be purchased without purchasing an adult ticket.');
});

test("Can't purchase an infant ticket without an adult", () => {
  const ticketTypeRequests = [new TicketTypeRequest('INFANT',1)]
  
  expect(() => {
    ticketService.purchaseTickets(1, ticketTypeRequests)
  }).toThrow('Child or infant tickets cannot be purchased without purchasing an adult ticket.');
});

test("Purchasing 1 adult ticket needs to cost £20 and reserve 1 seat", () => {
  const ticketTypeRequests = [new TicketTypeRequest('ADULT',1)]

  expect(ticketService.purchaseTickets(1, ticketTypeRequests)).toStrictEqual({
    'totalAmountToPay': 20,
    'totalSeatsToAllocate': 1
  });
});

test("Purchasing 1 adult ticket and 1 child ticket needs to cost £30 and reserve 2 seats", () => {
  const ticketTypeRequests = [
    new TicketTypeRequest('ADULT',1),
    new TicketTypeRequest('CHILD',1)
  ]
  
  expect(ticketService.purchaseTickets(1, ticketTypeRequests)).toStrictEqual({
    'totalAmountToPay': 30,
    'totalSeatsToAllocate': 2
  });
});

test("Purchasing 1 adult ticket and 1 infant ticket needs to cost £20 and reserve 1 seat", () => {
  const ticketTypeRequests = [
    new TicketTypeRequest('ADULT',1),
    new TicketTypeRequest('INFANT',1)
  ]
  
  expect(ticketService.purchaseTickets(1, ticketTypeRequests)).toStrictEqual({
    'totalAmountToPay': 20,
    'totalSeatsToAllocate': 1
  });
});

test("Purchasing 2 adults ticket needs to cost £40 and reserve 2 seat", () => {
  const ticketTypeRequests = [new TicketTypeRequest('ADULT',2)]

  expect(ticketService.purchaseTickets(1, ticketTypeRequests)).toStrictEqual({
    'totalAmountToPay': 40,
    'totalSeatsToAllocate': 2
  });
});

test("Purchasing 2 adults ticket and 3 children ticket needs to cost £70 and reserve 5 seat", () => {
  const ticketTypeRequests = [
    new TicketTypeRequest('ADULT',2),
    new TicketTypeRequest('CHILD',3)
  ]
  
  expect(ticketService.purchaseTickets(1, ticketTypeRequests)).toStrictEqual({
    'totalAmountToPay': 70,
    'totalSeatsToAllocate': 5
  });
});

test("Purchasing 2 adults ticket, 2 children and 1 infant ticket needs to cost £60 and reserve 4 seat", () => {
  const ticketTypeRequests = [
    new TicketTypeRequest('ADULT',2),
    new TicketTypeRequest('CHILD',2),
    new TicketTypeRequest('INFANT',1)
  ]
  
  expect(ticketService.purchaseTickets(1, ticketTypeRequests)).toStrictEqual({
    'totalAmountToPay': 60,
    'totalSeatsToAllocate': 4
  });
});