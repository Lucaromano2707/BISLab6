package de.hsog.betrinfo.model;

import java.util.Date;
import java.util.List;

public class Order {

    private int orderNumber;
    private Date orderDate;
    private Date requiredDate;
    private Date shippedDate;
    private String status;
    private String comments;
    private int customerNumber;
    private List<OrderDetail> orderDetails; // Zum Abbilden der 1:n-Beziehung
    // Eine Bestellung kann mehrere Positionen (orderdetails) haben; Liste von OrderDetail-Objekten

    // Alles für orderNumber
    public int getOrderNumber() {
        return orderNumber;
    }
    public void setOrderNumber(int orderNumber) {
        this.orderNumber = orderNumber;
    }

    // Alles für orderDate
    public Date getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    // Alles für requiredDate
    public Date getRequiredDate() {
        return requiredDate;
    }
    public void setRequiredDate(Date requiredDate) {
        this.requiredDate = requiredDate;
    }

    // Alles für shippedDate
    public Date getShippedDate() {
        return shippedDate;
    }
    public void setShippedDate(Date shippedDate) {
        this.shippedDate = shippedDate;
    }

    // Alles für status
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    // Alles für comments
    public String getComments() {
        return comments;
    }
    public void setComments(String comments) {
        this.comments = comments;
    }

    // Alles für customerNumber
    public int getCustomerNumber() {
        return customerNumber;
    }
    public void setCustomerNumber(int customerNumber) {
        this.customerNumber = customerNumber;
    }

    // Alles für orderDetails
    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }
    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }
}