import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js'
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js'

export default class TicketService {
  #totalAmountToPay
  #totalSeatsToAllocate
    
  //check for errors
  #checkForValidRequest(accountId, ticketTypeRequests) {
    // throw error if accountId isn't positive
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException('accountId must be a positive integer')
    }

    if (!Array.isArray(ticketTypeRequests)) {
      throw new InvalidPurchaseException('ticketTypeRequests must be an array')
    }
    
    //check if adult ticket is purchased and calculate the number of tickets
    let totalTickets = 0
    let adultTicketPurchased = false

    ticketTypeRequests.map((ticketTypeRequest) => {
      if (ticketTypeRequest.getTicketType() == 'ADULT') {
        adultTicketPurchased = true
      }

      totalTickets += ticketTypeRequest.getNoOfTickets()
    });
    
    // throw error if ticket count > 20 or there are no tickets
    if (totalTickets > 20) {
      throw new InvalidPurchaseException('Only a maximum of 20 tickets that can be purchased at a time')
    } else if (totalTickets === 0) {
      throw new InvalidPurchaseException('At least one ticket is needed to complete the purchase')
    }

    // throw error if there's no adult ticket
    if (!adultTicketPurchased) {
      throw new InvalidPurchaseException('Child or infant tickets cannot be purchased without purchasing an adult ticket.')
    }

    return true
  }

  //calculate cost
  #calculateCost(ticketTypeRequests) {
    let initialValue = 0

    const totalCost = ticketTypeRequests.reduce((accumulateCost, ticketTypeRequest) => {
      const cost = ticketTypeRequest.getNoOfTickets() * this.#prices[ticketTypeRequest.getTicketType()];
      
      return accumulateCost + cost
    }, initialValue);

    return totalCost
  }

  //calculate number of seats
  #calculateSeats(ticketTypeRequests) {
    const initialValue = 0

    const totalSeats = ticketTypeRequests.reduce((seat, ticketTypeRequest) => {
      // Infants don't get the seats
      if (ticketTypeRequest.getTicketType() != 'INFANT') {
        return seat + ticketTypeRequest.getNoOfTickets()
      } else {
        return seat
      }    
    }, initialValue)

    return totalSeats
  }

  //take payment
  #takePayment(accountId) {
    let ticketPaymentService = new TicketPaymentService
    ticketPaymentService.makePayment(accountId, this.#totalAmountToPay)
  }

  //reserve seat
  #reserveSeats(accountId) {
    let seatReservationService = new SeatReservationService
    seatReservationService.reserveSeat(accountId, this.#totalSeatsToAllocate)
  }

  purchaseTickets(accountId, ticketTypeRequests) {
    this.#checkForValidRequest(accountId, ticketTypeRequests)

    this.#totalAmountToPay = this.#calculateCost(ticketTypeRequests)

    this.#totalSeatsToAllocate = this.#calculateSeats(ticketTypeRequests)

    this.#takePayment(accountId)

    this.#reserveSeats(accountId)

    const summary = {
      'totalAmountToPay': this.#totalAmountToPay,
      'totalSeatsToAllocate': this.#totalSeatsToAllocate
    }

    return summary
  }

  #prices = {
    'ADULT': 20,
    'CHILD': 10,
    'INFANT': 0
  };
}