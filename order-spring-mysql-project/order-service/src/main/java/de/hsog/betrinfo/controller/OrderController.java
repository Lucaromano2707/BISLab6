package de.hsog.betrinfo.controller;

// import model.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import de.hsog.betrinfo.model.Order;
import de.hsog.betrinfo.model.OrderDetail;
import java.util.List;
import java.util.ArrayList;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/rest")
public class OrderController {

    public static final String URL = "jdbc:mysql://mysqldb:3306/orderdb";
    public static final String USER = "root";
    public static final String PASSWORD = "example";
    public static final String DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";
    static {
        try{
            Class.forName(DRIVER_CLASS);
        } catch (ClassNotFoundException e){
            throw new RuntimeException();
        }
    }

    @RequestMapping(value = "/orders/{id}", method = RequestMethod.GET)
    public ResponseEntity<Order> getOrder(@PathVariable int id) {
        Order order = new Order();
        String queryOrder = "SELECT * FROM orders WHERE orderNumber = ?";
        String queryDetail = "SELECT * FROM orderdetails WHERE orderNumber = ?";
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD);
            PreparedStatement pstOrder = connection.prepareStatement(queryOrder);
            PreparedStatement pstDetail = connection.prepareStatement(queryDetail))
        {
            
            pstOrder.setInt(1, id);
            ResultSet rs = pstOrder.executeQuery();

            if (rs.next()) {
                order.setOrderNumber(rs.getInt("orderNumber"));
                order.setOrderDate(rs.getDate("orderDate"));
                order.setRequiredDate(rs.getDate("requiredDate"));
                order.setShippedDate(rs.getDate("shippedDate"));
                order.setStatus(rs.getString("status"));
                order.setComments(rs.getString("comments"));
                order.setCustomerNumber(rs.getInt("customerNumber"));

                // Laden der zugehörigen OrderDetails
                pstDetail.setInt(1, id);
                ResultSet rsDetails = pstDetail.executeQuery();

                List<OrderDetail> details = new ArrayList<>();
                while (rsDetails.next()) {
                    OrderDetail d = new OrderDetail();
                    d.setOrderNumber(rsDetails.getInt("orderNumber"));
                    d.setProductCode(rsDetails.getString("productCode"));
                    d.setQuantityOrdered(rsDetails.getInt("quantityOrdered"));
                    d.setPriceEach(rsDetails.getDouble("priceEach"));
                    d.setOrderLineNumber(rsDetails.getShort("orderLineNumber"));
                    details.add(d);
                }
                rsDetails.close();
                order.setOrderDetails(details);
            } else {
                return ResponseEntity.notFound().build();
            }

            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok(order);
    }

    @RequestMapping(value = "/orders", method = RequestMethod.POST)
    public ResponseEntity<String> createOrder(@RequestBody Order order) {
        String sql = "INSERT INTO orders (orderNumber, orderDate, requiredDate, shippedDate, status, comments, customerNumber) " +
             "VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD);
            PreparedStatement pst = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
        ) {
            pst.setInt(1, order.getOrderNumber());
            pst.setDate(2, new Date(order.getOrderDate().getTime()));
            pst.setDate(3, new Date(order.getRequiredDate().getTime()));
            if (order.getShippedDate() != null) {
                pst.setDate(4, new Date(order.getShippedDate().getTime()));
            } else {
                pst.setNull(4, Types.DATE);
            }
            pst.setString(5, order.getStatus());
            pst.setString(6, order.getComments());
            pst.setInt(7, order.getCustomerNumber());

            int i = pst.executeUpdate();
            ResultSet rs = pst.getGeneratedKeys();

            if (rs.next()) {
                int newOrderId = rs.getInt(1);
                for (OrderDetail detail : order.getOrderDetails()) {
                    String details = "INSERT INTO orderdetails (orderNumber, productCode, quantityOrdered, priceEach, orderLineNumber) " +
                        "VALUES (?, ?, ?, ?, ?)";
                    try (PreparedStatement detailsPst = connection.prepareStatement(details)) {
                        detailsPst.setInt(1, newOrderId);
                        detailsPst.setString(2, detail.getProductCode());
                        detailsPst.setInt(3, detail.getQuantityOrdered());
                        detailsPst.setDouble(4, detail.getPriceEach());
                        detailsPst.setInt(5, detail.getOrderLineNumber());
                        detailsPst.executeUpdate();
                    }
                }
                // String newOrderUrl = "http://localhost:8082/order-service/rest/orders/" + newOrderId;
            }
            else {
                connection.rollback();
                throw new SQLException("Failed to insert orderDetails");
            }

            if (i > 0) {
                return ResponseEntity.ok("Order inserted");
            } else {
                return ResponseEntity.internalServerError().body("Insert failed in Orders");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
