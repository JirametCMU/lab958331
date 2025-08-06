document.addEventListener('DOMContentLoaded', function() {
    
    const contactButton = document.getElementById('viewContactBtn');

    contactButton.addEventListener('click', function() {
        // You can change this to a modal or show a hidden div
        alert(
            'Contact Information:\n\n' +
            'Email: jiramet_s@cmu.ac.th\n' +
            'Phone: 012-345-6789'
        );
    });

});