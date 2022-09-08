## Assumptions made by me

- `ticketTypeRequests` parameter in the `TicketService` class is populated with an array of `TicketTypeRequest`
- Tickets are group together by their types. So, if there are two adult tickets and one child ticket that needs purchasing, `ticketTypeRequests` array will populate with two `TicketTypeRequest` objects. The first `TicketTypeRequest` object will populate with `type` as 'ADULT' and  `noOfTickets` as 2. The second `TicketTypeRequest` object will populate with `type` as 'CHILD' and  `noOfTickets` as 1.
- If `TicketTypeRequest` objects, it's okay.
- If `TicketTypeRequest` object is created before `TicketTypeRequest` class is used and `TicketTypeRequest` already has validation for `type` and `noOfTickets`, I can assume that those two are valid.
- `noOfTickets` must be a positive integer
- I need to test `TicketService` as well

## Libraries installed for testing

- jest
- babel-jest

To test, run `npm install` and then `npm run test` in the terminal