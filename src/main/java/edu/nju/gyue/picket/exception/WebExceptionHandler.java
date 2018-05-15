package edu.nju.gyue.picket.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
@ResponseBody
public class WebExceptionHandler {

    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    public String resourceNotFoundHandler(ResourceNotFoundException e) {
        return e.getMessage();
    }

    @ResponseStatus(value = HttpStatus.CONFLICT)
    @ExceptionHandler(ResourceConflictException.class)
    public String resourceConflictHandler(ResourceConflictException e) {
        return e.getMessage();
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BadRequestException.class)
    public String invalidRequestHandler(BadRequestException e) {
        return e.getMessage();
    }

    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler(NumberFormatException.class)
    public String numberFormatExceptionHandler(NumberFormatException e) {
        return "编号不符合规范";
    }

}
