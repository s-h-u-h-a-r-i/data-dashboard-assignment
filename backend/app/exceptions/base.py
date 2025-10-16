from typing import Any, Dict, Optional
from fastapi import status


class ApplicationException(Exception):
    """
    ### Base exception class for all application-specific errors.

    This class provides a standardized structure for exceptions within the application,
    allowing for consistent error handling and response formatting.

    Attributes:
        message (str): A human-readable message describing the error.
        status_code (int): The HTTP status code associated with the error.
        details (Dict[str, Any]): Optional dictionary for additional error details.
    """

    def __init__(
        self,
        message: str = "An unexpected error occurred",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        ### Initializes a new instance of ApplicationException.

        Args:
            message: A human-readable message describing the error.
                Defaults to "An unexpected error occurred".
            status_code: The HTTP status code associated with the error.
                Defaults to HTTP_500_INTERNAL_SERVER_ERROR.
            details: Optional dictionary for additional
                error details. Defaults to an empty dict.
        """
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

    def to_dict(self) -> Dict[str, Any]:
        """
        ### Converts exception to dictionary.

        Converts the exception instance into a dictionary suitable for API responses.

        Returns:
            A dictionary containing the error name, message, and details.
        """
        return {
            "error": self.__class__.__name__,
            "message": self.message,
            "details": self.details,
        }


__all__ = ("ApplicationException",)
