USE [gcti_ucs_db]
GO

/****** Object:  StoredProcedure [dbo].[get_interaction_attachment_by_id]    Script Date: 07/04/2023 12:10:50 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER   PROCEDURE [dbo].[get_interaction_attachment_by_id] (
	@attachment_id NVARCHAR(200),
	@result_code int OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;
    SET @result_code = 0;

	select * from dbo.Document doc
	where doc.Id = @attachment_id

	RETURN;
END;
GO


