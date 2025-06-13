import os
import logging
from paypalserversdk.http.auth.o_auth_2 import ClientCredentialsAuthCredentials
from paypalserversdk.logging.configuration.api_logging_configuration import (
    LoggingConfiguration, RequestLoggingConfiguration, ResponseLoggingConfiguration,
)
from paypalserversdk.paypal_serversdk_client import PaypalServersdkClient

# Inicializa cliente de PayPal para todo tu sistema
paypal_client: PaypalServersdkClient = PaypalServersdkClient(
    client_credentials_auth_credentials=ClientCredentialsAuthCredentials(
        o_auth_client_id=os.getenv("PAYPAL_CLIENT_ID"),
        o_auth_client_secret=os.getenv("PAYPAL_CLIENT_SECRET"),
    ),
    logging_configuration=LoggingConfiguration(
        log_level=logging.INFO,
        mask_sensitive_headers=False,
        request_logging_config=RequestLoggingConfiguration(log_headers=True, log_body=True),
        response_logging_config=ResponseLoggingConfiguration(log_headers=True, log_body=True),
    ),
)
