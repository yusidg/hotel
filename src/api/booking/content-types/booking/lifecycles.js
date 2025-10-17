module.exports = {
  async afterCreate(event) {
    const { result } = event;

    try {
      // Fetch full booking with populated hotel & city
      const fullBooking = await strapi.db.query('api::booking.booking').findOne({
        where: { id: result.id },
        populate: {
          hotel: true,
          city: true,
        },
      });

      const hotel = fullBooking?.hotel;
      const city = fullBooking?.city;
console.log("result",result)
      // Prepare email content
      const emailContent = `
        <h2>🛎 New Booking Created!</h2>
        <p><strong>Customer:</strong> ${fullBooking?.username}</p>
        <p><strong>Phone:</strong> ${fullBooking?.phone_number}</p>
        <p><strong>City:</strong> ${city?.name}</p>
        <hr />
        <h3>Hotel Details:</h3>
        <p><strong>Name:</strong> ${hotel?.name}</p>
        <p><strong>Rating:</strong> ${hotel?.Rating} ⭐</p>
        <p><strong>Price Range:</strong> ₹${hotel?.Price_Range}</p>
        <p><strong>Sale Off:</strong> ${hotel?.saleOff}</p>
        <p><strong>Max Guests:</strong> ${hotel?.maxGuests}</p>
        <p><strong>Bedrooms:</strong> ${hotel?.bedrooms}</p>
        <p><strong>Bathrooms:</strong> ${hotel?.bathrooms}</p>
        <hr />
        <h3>Booking Details:</h3>
        <p><strong>Check-in:</strong> ${new Date(fullBooking?.Check_in_Date).toLocaleString()}</p>
        <p><strong>Check-out:</strong> ${new Date(fullBooking?.Check_out_Date).toLocaleString()}</p>
        <p><strong>Guests:</strong> ${fullBooking?.Guests}</p>
        <p><strong>Total Price:</strong> ₹${fullBooking?.total_price}</p>
        <p><strong>Status:</strong> ${fullBooking?.Booking_status}</p>
<a href="${result.hotel_link}"><strong>Link:</strong> ${result.hotel_link}</a>
      `;

      // Send email
      await strapi.plugins['email'].services.email.send({
        to: 'kdhabib738@gmail.com',
        from: 'yusidg709@gmail.com',    // verified sender
        subject: `New Booking at ${hotel.name}`,
        html: emailContent,              // using HTML format
      });

      console.log("✅ Email sent successfully for booking ID:", fullBooking?.id);

    } catch (error) {
      console.error("❌ Failed to send booking email:", error);
    }
  },
};
