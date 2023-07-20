USE [gcti_ucs_db]
GO

/****** Object:  StoredProcedure [dbo].[get_contacts]    Script Date: 21-Apr-23 5:36:05 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER      PROCEDURE [dbo].[get_contacts] (
	@search_input NVARCHAR(200) = null,	
	@result_code int OUTPUT	
)
AS
BEGIN
    SET NOCOUNT ON;
    SET @result_code = 0;

	-- The main select statement
	SELECT 
		contact.*, 
		contact.StrAttribute1 + ' ' + contact.StrAttribute2 AS AgentFullName 
	FROM dbo.Contact contact where (
		@search_input is null OR
			-- First name
			contact.StrAttribute1 LIKE '%' + ISNULL(@search_input, '') + '%'
			-- Last name
			OR contact.StrAttribute2 LIKE '%' + ISNULL(@search_input, '') + '%'
			-- First-last name
			OR contact.StrAttribute1 + ' ' + contact.StrAttribute2 LIKE '%' + ISNULL(@search_input, '') + '%'
			-- Last-first name
			OR contact.StrAttribute2 + ' ' + contact.StrAttribute1 LIKE '%' + ISNULL(@search_input, '') + '%'
		)

	RETURN;
END;
GO


