import React, { useEffect, useState } from 'react';
import { Table, Container, Pagination } from 'react-bootstrap';
import axios from 'axios';
import './AdminStyle/RevenueTable.css';

const RevenueTable = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = () => {
    const sortedOrders = [...orders].sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.OrderDate) - new Date(b.OrderDate);
      } else {
        return new Date(b.OrderDate) - new Date(a.OrderDate);
      }
    });
    setOrders(sortedOrders);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    axios.get('http://localhost:9999/detailOrders')
      .then(response => {
        const data = response.data;
        const completedOrders = data.filter(order => order.status === true);
        const revenue = completedOrders.reduce((sum, order) => sum + order.Amount, 0);

        completedOrders.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));

        setOrders(completedOrders);
        setTotalRevenue(revenue);
      })
      .catch(error => console.error('Axios error:', error));
  }, []);

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <div className="table-header">
        <h1>Revenue Table</h1>
        <h2>Total Revenue: {totalRevenue.toLocaleString()} vnđ</h2>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>
              Order Date - <span onClick={handleSort} 
                style={{color:'blue', cursor: 'pointer', userSelect: 'none'}}>Sort
              </span>
            </th>
            <th>Customer Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.OrderDate}</td>
              <td>{`${order.customer.name.firstname} ${order.customer.name.lastname}`}</td>
              <td>{order.Amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default RevenueTable;
