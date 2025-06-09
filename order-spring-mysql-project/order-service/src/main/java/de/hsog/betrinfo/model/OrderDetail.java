package de.hsog.betrinfo.model;

public class OrderDetail {

    private int orderNumber;
    private String productCode;
    private int quantityOrdered;
    private double priceEach;
    private short orderLineNumber;

    // Alles für orderNumber
    public int getOrderNumber() {
        return orderNumber;
    }
    public void setOrderNumber(int orderNumber) {
        this.orderNumber = orderNumber;
    }

    // Alles für productCode
    public String getProductCode() {
        return productCode;
    }
    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    // Alles für quantityOrdered
    public int getQuantityOrdered() {
        return quantityOrdered;
    }
    public void setQuantityOrdered(int quantityOrdered) {
        this.quantityOrdered = quantityOrdered;
    }

    // Alles für priceEach
    public double getPriceEach() {
        return priceEach;
    }
    public void setPriceEach(double priceEach) {
        this.priceEach = priceEach;
    }

    // Alles für orderLineNumber
    public short getOrderLineNumber() {
        return orderLineNumber;
    }
    public void setOrderLineNumber(short orderLineNumber) {
        this.orderLineNumber = orderLineNumber;
    }
}
