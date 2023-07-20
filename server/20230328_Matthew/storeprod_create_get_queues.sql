USE [gcti_ucs_db]
GO

/****** Object:  StoredProcedure [dbo].[get_queues]    Script Date: 04-Jul-23 3:50:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE OR ALTER        PROCEDURE [dbo].[get_queues] (
	@search_input NVARCHAR(200) = null,	
	@result_code int OUTPUT	
)
AS
BEGIN
    SET NOCOUNT ON;
    SET @result_code = 0;

	-- The main select statement
	SELECT 
		contact.*	
	FROM dbo.Contact contact where (
		@search_input is null OR
			-- Partial queue name
			contact.StrAttribute3 LIKE '%' + ISNULL(@search_input, '') + '%'			
		)

	RETURN;
END;
GO


