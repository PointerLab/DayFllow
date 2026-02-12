from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import CustomUser

class UserRegistrationTest(APITestCase):
    def test_user_registration_creates_hr(self):
        """
        Ensure new users are created as HR.
        """
        url = reverse('user-registration')
        data = {
            'email': 'test@example.com',
            'password': 'password123',
            'first_name': 'Test',
            'last_name': 'User',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 1)
        user = CustomUser.objects.get()
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.role, 'HR')
        self.assertTrue(user.is_staff)
        self.assertFalse(user.is_approved)
