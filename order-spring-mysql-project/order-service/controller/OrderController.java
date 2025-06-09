package controller;

import model.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.Date;

@RestController
@RequestMapping("/order-service/rest/orders")
public class OrderController {

    public static final String URL = "jdbc:mysql://mysqldb:3306/orderdb";
    public static final String USER = "root";
    public static final String PASSWORD = "example";
    public static final String DRIVER_CLASS = "com.mysql.cj.jdbc.Driver";

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable int id) {
        Order order = new Order();
        try {
            Class.forName(DRIVER_CLASS);
            Connection connection = DriverManager.getConnection(URL, USER, PASSWORD);
            Statement statement = connection.createStatement();
            ResultSet rs = statement.executeQuery("SELECT * FROM orders WHERE orderNumber = " + id);

            if (rs.next()) {
                order.setOrderNumber(rs.getInt("orderNumber"));
                order.setOrderDate(rs.getDate("orderDate"));
                order.setRequiredDate(rs.getDate("requiredDate"));
                order.setShippedDate(rs.getDate("shippedDate"));
                order.setStatus(rs.getString("status"));
                order.setComments(rs.getString("comments"));
                order.setCustomerNumber(rs.getInt("customerNumber"));

                // Laden der zugehörigen OrderDetails
                ResultSet rsDetails = statement.executeQuery(
                    "SELECT * FROM orderdetails WHERE orderNumber = " + id
                );

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
            statement.close();
            connection.close();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok(order);
    }

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody Order order) {
        try {
            Class.forName(DRIVER_CLASS);
            Connection connection = DriverManager.getConnection(URL, USER, PASSWORD);
            Statement statement = connection.createStatement();

            String sql = String.format(
                "INSERT INTO orders (orderNumber, orderDate, requiredDate, shippedDate, status, comments, customerNumber) " +
                "VALUES (%d, '%s', '%s', '%s', '%s', '%s', %d)",
                order.getOrderNumber(),
                new java.sql.Date(order.getOrderDate().getTime()),
                new java.sql.Date(order.getRequiredDate().getTime()),
                order.getShippedDate() != null ? new java.sql.Date(order.getShippedDate().getTime()) : null,
                order.getStatus(),
                order.getComments(),
                order.getCustomerNumber()
            );

            int i = statement.executeUpdate(sql);

            statement.close();
            connection.close();

            if (i > 0) {
                return ResponseEntity.ok("Order inserted");
            } else {
                return ResponseEntity.internalServerError().body("Insert failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
